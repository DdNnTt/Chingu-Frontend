'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import CheckableInput from '@/components/common/CheckableInput';
import Input from '@/components/common/Input';
import Button from '@/components/common/Button';
import { getCookieValue } from '@/utils/cookie';

const MypageSchema = z.object({
  nickname: z.string().min(2, '닉네임은 2자 이상 입력해주세요.'),
  name: z.string(),
  userId: z.string(),
  email: z.string().email('유효한 이메일 형식이 아닙니다.'),
  isNicknameChecked: z.literal(true).refine((val) => val === true, {
    message: '닉네임 중복 확인을 해주세요',
  }),
});

type MypageFormValues = z.infer<typeof MypageSchema>;

export default function Mypage() {
  const router = useRouter();
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isEditable, setIsEditable] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register, reset, getValues, setValue } = useForm<MypageFormValues>({
    resolver: zodResolver(MypageSchema),
    defaultValues: {
      nickname: '',
      name: '',
      userId: '',
      email: '',
      isNicknameChecked: true,
    },
  });

  useEffect(() => {
    const token = getCookieValue('accessToken');

    if (!token) return;

    fetch('/api/users/mypage', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(async (res) => {
        if (res.status === 401) {
          alert('세션이 만료되었습니다. 다시 로그인해 주세요.');
          router.push('/front/account/login');
          return;
        }
        if (!res.ok) throw new Error('유저 정보 조회 실패');
        return res.json();
      })
      .then((data) => {
        if (!data) return;

        reset({
          nickname: data.nickname || '',
          name: data.name || '',
          userId: data.userId || '',
          email: data.email || '',
        });

        if (data.profilePictureUrl) setImagePreview(data.profilePictureUrl);
      })
      .catch((err) => console.error('[유저 정보 불러오기 오류]', err));
  }, [router, reset]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePasswordEdit = () => {
    const getCookieValue = (name: string) => {
      const match = document.cookie.match(new RegExp(`(^| )${name}=([^;]+)`));
      return match ? decodeURIComponent(match[2]) : null;
    };

    const token = getCookieValue('accessToken');
    if (!token) {
      alert('로그인이 필요합니다.');
      router.push('/front/account/login');
      return;
    } else {
      router.push('/front/my-page/change-pw');
    }
  };

  const handleWithdraw = () => {
    const getCookieValue = (name: string) => {
      const match = document.cookie.match(new RegExp(`(^| )${name}=([^;]+)`));
      return match ? decodeURIComponent(match[2]) : null;
    };

    const token = getCookieValue('accessToken');
    if (!token) {
      alert('로그인이 필요합니다.');
      router.push('/front/account/login');
      return;
    } else {
      router.push('/front/account/del-account');
    }
  };

  const handleBlockedClick = (e: React.MouseEvent) => {
    if (!isEditable) {
      e.preventDefault();
      e.stopPropagation();
      alert('수정을 원하시면 "마이페이지 수정" 버튼을 눌러주세요.');
    }
  };

  const handleSubmitEdit = async () => {
    const getCookieValue = (name: string) => {
      const match = document.cookie.match(new RegExp(`(^| )${name}=([^;]+)`));
      return match ? decodeURIComponent(match[2]) : null;
    };

    const token = getCookieValue('accessToken');
    if (!token) {
      alert('로그인이 필요합니다.');
      router.push('/front/account/login');
      return;
    }

    const values = getValues();
    let uploadedImageUrl = imagePreview;

    try {
      setIsSubmitting(true);

      // 새로 업로드한 이미지 파일이 있다면
      const fileInput =
        document.querySelector<HTMLInputElement>('input[type="file"]');
      const file = fileInput?.files?.[0];

      if (file) {
        const ext = file.name.split('.').pop()?.toLowerCase() || 'jpg';

        // 1. presigned URL 요청
        const presignRes = await fetch(
          `/api/users/upload-url/profile?extension=${ext}`,
          {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const { uploadUrl, fileUrl } = await presignRes.json();
        console.log('[프로필 업로드 응답]', { uploadUrl, fileUrl });

        // 2. S3로 이미지 업로드
        await fetch(uploadUrl, {
          method: 'PUT',
          headers: {
            'Content-Type': file.type,
          },
          body: file,
        });

        // 3. 업로드된 이미지 URL 저장 및 반영
        uploadedImageUrl = fileUrl;
        setImagePreview(fileUrl);
      }

      // 최종 수정 요청
      const payload = {
        nickname: values.nickname,
        email: values.email,
        profilePictureUrl: uploadedImageUrl || '',
      };

      const res = await fetch('/api/users/mypage/edit', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        console.error('[수정 실패]', data);
        alert('수정에 실패했습니다.');
        return;
      }

      alert('정보가 성공적으로 수정되었습니다.');
      setIsEditable(false);
    } catch (err) {
      console.error('[정보 수정 오류]', err);
      alert('정보 수정 중 오류가 발생했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // const handleImageRemove = () => {
  //   setImagePreview(null);
  // };

  return (
    <div className="mypage-page py-24 px-4 mx-auto rounded-lg bg-gray-100">
      {/* <h2 className="text-2xl font-semibold mb-6 text-center">마이페이지</h2> */}

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
        <h2 className="text-2xl font-semibold text-center flex-1">
          마이페이지
        </h2>
      </div>

      <div
        className="mb-4 p-4 pr-1 bg-white rounded-lg shadow-sm gap-2 max-h-[410px] overflow-y-auto scroll-overlay"
        style={{ scrollbarGutter: 'stable' }}
      >
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold mb-2">내 정보</h3>
          <Button
            type="button"
            onClick={() => setIsEditable(true)}
            className="!text-xs !p-2 !bg-[#aa96fc] text-white mb-4"
          >
            마이페이지 수정
          </Button>
        </div>

        <div onClick={handleBlockedClick}>
          {/* 닉네임 - 중복 확인 api */}
          <div className={isEditable ? '' : 'pointer-events-none'}>
            <CheckableInput<MypageFormValues>
              name="nickname"
              placeholder="닉네임"
              checkUrl="/api/users/check-nickname"
              queryKey="nickname"
              successMessage="사용 가능한 닉네임입니다."
              failureMessage="이미 사용 중인 닉네임입니다."
              register={register}
              getValues={getValues}
              setValue={setValue}
              flagField="isNicknameChecked"
            />
          </div>

          {/* 이름 */}
          <div className="relative mb-6">
            <Input
              type="text"
              placeholder="이름"
              {...register('name')}
              readOnly={!isEditable}
              onClick={(e) => {
                if (!isEditable) {
                  e.stopPropagation();
                  alert('수정을 원하시면 "마이페이지 수정" 버튼을 눌러주세요.');
                }
              }}
            />
          </div>

          {/* 아이디 */}
          <div className="relative mb-6">
            <Input
              type="text"
              placeholder="아이디"
              {...register('userId')}
              readOnly={!isEditable}
              onClick={(e) => {
                if (!isEditable) {
                  e.stopPropagation();
                  alert('수정을 원하시면 "마이페이지 수정" 버튼을 눌러주세요.');
                }
              }}
            />
          </div>

          {/* 이메일 */}
          <div className="relative mb-6">
            <Input
              type="email"
              placeholder="이메일"
              {...register('email')}
              readOnly={!isEditable}
              onClick={(e) => {
                if (!isEditable) {
                  e.stopPropagation();
                  alert('수정을 원하시면 "마이페이지 수정" 버튼을 눌러주세요.');
                }
              }}
            />
          </div>

          {/* 프로필 이미지 */}
          <div className="mb-4">
            <label className="block font-medium text-sm mb-1">
              프로필 이미지
            </label>

            <div className="flex flex-col items-center gap-4">
              {/* 프로필 이미지 미리보기 */}
              {imagePreview ? (
                <div className="w-full max-w-md">
                  <div className="flex justify-center">
                    <div className="relative w-32 h-32">
                      <Image
                        src={imagePreview}
                        alt="프로필 이미지"
                        width={128}
                        height={128}
                        className="w-full h-full rounded-lg object-cover border border-gray-200"
                      />
                      {isEditable && (
                        <button
                          type="button"
                          onClick={() => setImagePreview(null)}
                          className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600 transition-colors"
                        >
                          ×
                        </button>
                      )}
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
                    <p className="text-gray-500 text-sm">
                      프로필 이미지를 선택해주세요
                    </p>
                    <p className="text-gray-400 text-xs mt-1">
                      JPG, PNG 파일만 가능
                    </p>
                  </div>
                </div>
              )}

              {/* 파일 선택 버튼 */}
              {isEditable && (
                <div className="w-full max-w-md">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                    id="profile-upload"
                  />
                  <label
                    htmlFor="profile-upload"
                    className="w-full bg-[#9477ff] hover:bg-[#6845f5] text-white py-2 px-4 rounded-lg cursor-pointer transition-colors text-center block"
                  >
                    {imagePreview ? '이미지 변경' : '이미지 선택'}
                  </label>
                </div>
              )}
            </div>
          </div>

          {/* 수정 완료 버튼 */}
          {isEditable && (
            <Button
              type="button"
              onClick={handleSubmitEdit}
              className="w-full"
              disabled={isSubmitting}
            >
              {isSubmitting ? '수정 중...' : '수정 완료'}
            </Button>
          )}
        </div>
      </div>

      <div className="mb-4 p-4 bg-white rounded-lg shadow-sm gap-2">
        {/* 비밀번호 수정 버튼 */}
        <Button
          type="button"
          onClick={handlePasswordEdit}
          className="w-full mb-4"
        >
          비밀번호 수정
        </Button>

        {/* 회원 탈퇴 버튼 */}
        <Button
          type="button"
          onClick={handleWithdraw}
          className="w-full text-white"
          style={{
            backgroundColor: '#F55',
            borderColor: '#F55',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#e44';
            e.currentTarget.style.borderColor = '#e44';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = '#F55';
            e.currentTarget.style.borderColor = '#F55';
          }}
        >
          회원 탈퇴
        </Button>
      </div>
    </div>
  );
}
