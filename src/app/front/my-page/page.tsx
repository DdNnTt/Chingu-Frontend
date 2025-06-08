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
      router.push('/front/accout/login');
    } else {
      router.push('/front/my-page/change-pw');
    }
  };

  const handleWithdraw = () => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      alert('로그인이 필요합니다.');
      router.push('/front/accout/login');
    } else {
      router.push('/front/accout/del-account');
    }
  };

  return (
    <div className="mypage-page py-4 px-4 pt-20 mx-auto rounded-lg bg-gray-100">
      <h2 className="text-2xl font-semibold mb-6 text-center">마이페이지</h2>

      <div className="mb-4 p-4 bg-white rounded-lg shadow-sm gap-2">
        {/* 닉네임 - 중복 확인 api */}
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

        {/* 이름 */}
        <div className="relative mb-6">
          <Input
            type="text"
            placeholder="이름"
            {...register('name')}
            disabled
          />
        </div>

        {/* 아이디 */}
        <div className="relative mb-6">
          <Input
            type="text"
            placeholder="아이디"
            {...register('userId')}
            disabled
          />
        </div>

        {/* 이메일 */}
        <div className="relative mb-6">
          <Input
            type="email"
            placeholder="이메일"
            {...register('email')}
            disabled
          />
        </div>

        {/* 프로필 */}
        <div className="mb-4">
          <label className="block font-semibold mb-1">프로필</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="mb-2"
          />
          {imagePreview && (
            <div className="border w-32 h-32 relative">
              <Image
                src={imagePreview}
                alt="미리보기"
                fill
                className="object-cover rounded-md"
              />
            </div>
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

        <Button type="button" onClick={handleWithdraw} className="w-full">
          회원 탈퇴
        </Button>
      </div>
    </div>
  );
}
