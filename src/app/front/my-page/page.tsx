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
    const token = localStorage.getItem('accessToken');
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
    const token = localStorage.getItem('accessToken');
    if (!token) {
      alert('로그인이 필요합니다.');
      router.push('/front/account/login');
    } else {
      router.push('/front/my-page/change-pw');
    }
  };

  const handleWithdraw = () => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      alert('로그인이 필요합니다.');
      router.push('/front/account/login');
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
    const token = localStorage.getItem('accessToken');
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
    <div className="mypage-page overflow-y-auto py-20 px-4 mx-auto rounded-lg bg-gray-100">
      <h2 className="text-2xl font-semibold mb-6 text-center">마이페이지</h2>

      <div className="mb-4 p-4 bg-white rounded-lg shadow-sm gap-2">
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

          {/* 프로필 */}
          <div className="mb-4">
            <label className="block font-medium text-sm mb-1">프로필</label>

            <div className="w-20 h-20 relative">
              <Image
                src={imagePreview || '/images/default-profile.jpg'}
                alt="프로필 이미지"
                fill
                className="object-cover rounded-md"
              />
            </div>

            {/* 이미지 삭제 버튼 (수정 모드일 때만) */}
            {/* {isEditable && imagePreview && (
              <Button
                type="button"
                className="mt-2 mb-2 !text-xs !bg-red-500 text-white"
                onClick={handleImageRemove}
              >
                이미지 삭제
              </Button>
            )} */}

            {/* 파일 업로드 input */}
            {isEditable && (
              <input
                type="file"
                accept="image/*"
                className="mt-2 mb-2"
                onChange={handleImageChange}
              />
            )}
          </div>

          {/* 수정 완료 버튼 */}
          {isEditable && (
            <Button
              type="button"
              onClick={handleSubmitEdit}
              className="w-full !bg-[#aa96fc]"
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
        <Button type="button" onClick={handleWithdraw} className="w-full">
          회원 탈퇴
        </Button>
      </div>
    </div>
  );
}
