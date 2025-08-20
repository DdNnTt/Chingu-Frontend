'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import React, { useState } from 'react';
import Image from 'next/image';
import Input from '@/components/common/Input';
import Button from '@/components/common/Button';
import Calendar from 'react-calendar';
import { getCookieValue } from '@/utils/cookie';

type ValuePiece = Date | null;
type Value = ValuePiece | [ValuePiece, ValuePiece];

export default function AlbumAdd() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const groupId = searchParams.get('groupId');

  // 토큰 상태 확인
  const accessToken = getCookieValue('accessToken');

  // 사용자 정보 확인 (현재 미사용)
  let tokenPayload: Record<string, unknown> | null = null;
  if (accessToken) {
    try {
      tokenPayload = JSON.parse(atob(accessToken.split('.')[1]));
    } catch (e) {
      console.error('[앨범 추가 페이지] 토큰 디코딩 실패:', e);
    }
  }

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [value, setValue] = useState<Value>(new Date());
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [location, setLocation] = useState('');

  // 그룹 멤버십 확인
  const checkGroupMembership = async () => {
    if (!groupId || !accessToken) return;

    try {
      // 그룹 상세 정보 조회
      const groupResponse = await fetch(`/api/groups/${groupId}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (groupResponse.ok) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const groupData = await groupResponse.json();
        return;
      }

      const myGroupsResponse = await fetch('/api/groups/mygroups', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (myGroupsResponse.ok) {
        const myGroups = await myGroupsResponse.json();

        // 현재 그룹이 내 그룹 목록에 있는지 확인
        const isGroupMember = myGroups.some(
          (group: { groupId: number }) =>
            String(group.groupId) === String(groupId)
        );

        if (!isGroupMember) {
          console.warn(
            '[경고] 현재 사용자는 그룹 ID',
            groupId,
            '의 멤버가 아닙니다.'
          );
        }
      }
    } catch (error) {
      console.error('[그룹 멤버십 확인 오류]', error);
    }
  };

  // 페이지 로드 시 그룹 멤버십 확인
  React.useEffect(() => {
    if (groupId && accessToken) {
      checkGroupMembership();
    }
  }, [groupId, accessToken, checkGroupMembership]);

  const handleDateChange = (val: Value) => {
    setValue(val);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      const newFiles = [...selectedFiles, ...files];
      setSelectedFiles(newFiles);

      // 새로 추가한 파일 미리보기 생성
      files.forEach((file) => {
        const reader = new FileReader();
        reader.onload = () => {
          setImagePreviews((prev) => [...prev, reader.result as string]);
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const removeImage = (index: number) => {
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const formatDate = (date: Date) => {
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const dd = String(date.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // 입력값 확인
    if (!groupId) {
      console.error(
        '[앨범 추가 오류] groupId가 없습니다. URL 파라미터를 확인하세요.'
      );
      alert('그룹 ID가 없습니다. 그룹 페이지에서 다시 접근해주세요.');
      router.back();
      return;
    }

    // 토큰 검증
    const accessToken = getCookieValue('accessToken');
    if (!accessToken) {
      console.error('[앨범 추가 오류] 인증 토큰이 없습니다.');
      alert('로그인이 필요합니다. 다시 로그인해주세요.');
      router.push('/front/account/login');
      return;
    }
    if (!title.trim()) {
      alert('제목을 입력해주세요.');
      return;
    }
    if (!description.trim()) {
      alert('설명을 입력해주세요.');
      return;
    }
    if (!value) {
      alert('날짜를 선택해주세요.');
      return;
    }
    if (selectedFiles.length === 0) {
      alert('최소 1개의 이미지를 선택해주세요.');
      return;
    }

    const memoryDate = formatDate(Array.isArray(value) ? value[0]! : value!);

    const uploadedImageUrls: string[] = [];

    try {
      // 여러 이미지 업로드 처리
      if (selectedFiles.length > 0) {
        for (const file of selectedFiles) {
          const ext = file.name.split('.').pop()?.toLowerCase() || 'jpg';

          const presignRes = await fetch(
            `/api/albums/${groupId}/upload-url?extension=${ext}`,
            {
              method: 'GET',
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${accessToken}`,
              },
            }
          );

          if (presignRes.ok) {
            const responseData = await presignRes.json();

            // 앨범 presigned URL 응답 구조에 따라 URL 추출
            const uploadUrl =
              responseData.uploadUrl ||
              responseData.presignedUrl ||
              responseData.url ||
              responseData.additionalProp1 ||
              Object.values(responseData)[0];
            const fileUrl =
              responseData.fileUrl ||
              responseData.publicUrl ||
              responseData.downloadUrl ||
              responseData.additionalProp2 ||
              Object.values(responseData)[1];

            if (uploadUrl) {
              // S3로 이미지 업로드
              const uploadResponse = await fetch(uploadUrl, {
                method: 'PUT',
                headers: {
                  'Content-Type': file.type,
                },
                body: file,
              });

              if (uploadResponse.ok) {
                // fileUrl이 있으면 사용, 없으면 uploadUrl에서 쿼리 파라미터 제거
                const finalUrl = fileUrl || uploadUrl.split('?')[0];
                uploadedImageUrls.push(finalUrl);
              } else {
                console.error(
                  '[앨범 이미지 업로드 실패]',
                  file.name,
                  uploadResponse.status,
                  uploadResponse.statusText
                );
              }
            } else {
              console.error('[앨범 Presign URL 없음]', responseData);
            }
          } else {
            console.warn(
              `[앨범 Presign URL 요청 실패] ${file.name}:`,
              presignRes.status,
              presignRes.statusText
            );
          }
        }
      }

      // 이미지 업로드 실패 시 앨범 생성 중단
      if (selectedFiles.length > 0 && uploadedImageUrls.length === 0) {
        alert('이미지 업로드에 실패했습니다. 다시 시도해주세요.');
        return;
      }

      // 앨범 생성 API 호출
      const albumData: Record<string, unknown> = {
        title,
        content: description,
        location,
        memoryDate,
      };

      // 이미지가 있는 경우 imageUrl 필드 추가
      if (uploadedImageUrls.length > 0) {
        albumData.imageUrl1 = uploadedImageUrls[0];
        if (uploadedImageUrls.length > 1) {
          albumData.imageUrl2 = uploadedImageUrls[1];
        }
        if (uploadedImageUrls.length > 2) {
          albumData.imageUrl3 = uploadedImageUrls[2];
        }
      } else {
      }

      const createRes = await fetch(`/api/groups/${groupId}/albums`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(albumData),
      });

      if (createRes.ok) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const result = await createRes.json();
        alert('앨범이 성공적으로 추가되었습니다!');
        router.back();
      } else {
        let errorData;
        try {
          errorData = await createRes.json();
        } catch {
          const errorText = await createRes.text();
          console.error('[앨범 생성 실패 - 텍스트 응답]', {
            status: createRes.status,
            statusText: createRes.statusText,
            text: errorText,
          });
          alert(
            `앨범 생성에 실패했습니다: ${createRes.status} ${createRes.statusText} - ${errorText}`
          );
          return;
        }

        console.error('[앨범 생성 실패 - JSON 응답]', {
          status: createRes.status,
          statusText: createRes.statusText,
          data: errorData,
        });

        // 401 에러
        if (createRes.status === 401) {
          alert('로그인이 만료되었습니다. 다시 로그인해주세요.');
          // 만료된 토큰 쿠키 제거
          document.cookie =
            'accessToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
          router.push('/front/account/login');
          return;
        }

        // 403 에러
        if (createRes.status === 403) {
          // 그룹 멤버십 재확인
          console.log('[403 오류 발생] 그룹 멤버십 재확인 중...');

          try {
            const myGroupsRes = await fetch('/api/groups/mygroups', {
              headers: { Authorization: `Bearer ${accessToken}` },
            });

            if (myGroupsRes.ok) {
              const myGroups = await myGroupsRes.json();
              const isGroupMember = myGroups.some(
                (group: any) => String(group.groupId) === String(groupId)
              );

              console.log('[403 오류 시 멤버십 확인]', {
                groupId,
                isGroupMember,
                myGroups: myGroups.map((g: any) => ({
                  id: g.groupId,
                  name: g.groupName,
                })),
              });

              if (!isGroupMember) {
                alert(
                  `그룹 ID ${groupId}의 멤버가 아닙니다.\n\n내가 속한 그룹:\n${myGroups.map((g: any) => `- ${g.groupName} (ID: ${g.groupId})`).join('\n')}`
                );
              } else {
                alert(
                  '그룹 멤버이지만 앨범 작성 권한이 없습니다.\n관리자에게 문의해주세요.'
                );
              }
            } else {
              alert(
                '해당 그룹에 속한 사용자만 앨범을 작성할 수 있습니다.\n그룹 멤버십을 확인해주세요.'
              );
            }
          } catch (e) {
            console.error('[403 오류 시 멤버십 확인 실패]', e);
            alert(
              '해당 그룹에 속한 사용자만 앨범을 작성할 수 있습니다.\n그룹 멤버십을 확인해주세요.'
            );
          }

          router.back();
          return;
        }

        alert(
          `앨범 생성에 실패했습니다: ${errorData.message || errorData.error || `${createRes.status} ${createRes.statusText}`}`
        );
      }
    } catch (error) {
      console.error('[앨범 추가 오류]', error);
      alert('앨범 추가 중 오류가 발생했습니다.');
    }
  };

  // groupId가 없을 때 안내 메시지 표시
  if (!groupId) {
    return (
      <div className="group-detail-page h-screen flex flex-col py-4 px-4 pt-20 mx-auto rounded-lg bg-gray-100">
        <div className="flex items-center mb-6 flex-shrink-0">
          <button
            onClick={() => router.back()}
            className="text-gray-600 hover:text-gray-800"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"
              />
            </svg>
          </button>
          <h2 className="text-2xl font-semibold text-center flex-1">
            앨범 추가
          </h2>
        </div>

        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="text-6xl mb-4">⚠️</div>
            <h3 className="text-xl font-semibold mb-2">그룹 정보가 없습니다</h3>
            <p className="text-gray-600 mb-4">
              그룹 페이지에서 다시 접근해주세요.
            </p>
            <button
              onClick={() => router.push('/front/my-home')}
              className="bg-[#9477ff] hover:bg-[#6845f5] text-white px-6 py-2 rounded-lg"
            >
              홈으로 돌아가기
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="group-detail-page h-screen flex flex-col py-4 px-4 pt-20 mx-auto rounded-lg bg-gray-100">
      <div className="flex items-center mb-6">
        <button
          onClick={() => router.back()}
          className="text-gray-600 hover:text-gray-800"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"
            />
          </svg>
        </button>
        <h2 className="text-2xl font-semibold text-center flex-1">앨범 추가</h2>
      </div>

      <form
        onSubmit={handleSubmit}
        className="space-y-4 flex-1 overflow-y-auto scroll-overlay pb-20"
      >
        {/* 제목 */}
        <div className="mb-4 p-4 bg-white rounded-lg shadow-sm gap-2">
          <label className="block mb-1 font-medium">제목</label>
          <Input
            type="text"
            placeholder="제목을 입력해주세요."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        {/* 설명 */}
        <div className="mb-4 p-4 bg-white rounded-lg shadow-sm gap-2">
          <label className="block mb-1 font-medium">설명</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="설명을 입력해주세요."
            className="mt-1 block w-full px-3 py-2 border bg-[#f3f3f5] rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-indigo-300"
          />
        </div>

        {/* 이미지 첨부 */}
        <div className="mb-4 p-4 bg-white rounded-lg shadow-sm gap-2">
          <label className="block mb-1 font-medium">
            이미지 첨부 ({imagePreviews.length}장)
          </label>
          <div className="flex flex-col items-center gap-4">
            {/* 이미지 미리보기 슬라이더 */}
            {imagePreviews.length > 0 ? (
              <div className="w-full max-w-md">
                <div className="overflow-x-auto">
                  <div
                    className="flex gap-2 py-2 "
                    style={{ width: `${imagePreviews.length * 120}px` }}
                  >
                    {imagePreviews.map((preview, index) => (
                      <div
                        key={index}
                        className="relative flex-shrink-0 w-28 h-28"
                      >
                        <Image
                          src={preview}
                          alt={`미리보기 ${index + 1}`}
                          width={112}
                          height={112}
                          className="w-full h-full rounded-lg object-cover border border-gray-200"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-red-600 transition-colors"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="w-full max-w-md h-32 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center bg-gray-50">
                <div className="text-center">
                  <svg
                    className="w-12 h-12 text-gray-400 mx-auto mb-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  <p className="text-gray-500 text-sm">이미지를 선택해주세요</p>
                  <p className="text-gray-400 text-xs mt-1">
                    여러 장 선택 가능
                  </p>
                </div>
              </div>
            )}

            {/* 파일 선택 버튼 */}
            <div className="w-full max-w-md">
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageChange}
                className="hidden"
                id="image-upload"
              />
              <label
                htmlFor="image-upload"
                className="w-full bg-[#9477ff] hover:bg-[#6845f5] text-white py-2 px-4 rounded-lg cursor-pointer transition-colors text-center block"
              >
                {imagePreviews.length > 0 ? '이미지 추가' : '이미지 선택'}
              </label>
            </div>
          </div>
        </div>

        {/* 위치 입력 */}
        <div className="mb-4 p-4 bg-white rounded-lg shadow-sm gap-2">
          <label className="block mb-1 font-medium">위치</label>
          <div className="flex items-center gap-2">
            <div className="flex-1">
              <Input
                type="text"
                placeholder="위치를 입력해주세요 (예: 서울 강남구, 부산 해운대)"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            추억이 담긴 장소를 기록해보세요
          </p>
        </div>

        {/* 추억 날짜 선택 */}
        <div className="mb-4 p-4 bg-white rounded-lg shadow-sm gap-2">
          <p className="mb-1 font-medium">추억 날짜</p>
          {/* 날짜 선택 */}
          <Calendar
            value={value}
            onChange={handleDateChange}
            calendarType="iso8601"
            locale="ko-KR"
            formatDay={() => ''}
            tileClassName={({ date, view }) => {
              if (view !== 'month') return '';

              const day = date.getDay();
              if (day === 6) return 'weekday-saturday'; // 토요일
              return '';
            }}
            tileContent={({ date, view }) =>
              view === 'month' ? (
                <div
                  className={`color-round flex items-center justify-center mx-auto rounded-full w-[30px] h-[30px] ${
                    (Array.isArray(value)
                      ? value[0]?.toDateString()
                      : value?.toDateString()) === date.toDateString()
                      ? 'bg-[#baa8ff]'
                      : ''
                  }`}
                >
                  {date.getDate()}
                </div>
              ) : null
            }
          />
        </div>

        {/* 앨범 추가 버튼 */}
        <Button type="submit" className="w-full">
          앨범 추가
        </Button>
      </form>
    </div>
  );
}
