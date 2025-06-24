'use client';

import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import Button from '@/components/common/Button';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import Input from '@/components/common/Input';
import { getCookieValue } from '@/utils/cookie';

const DeleteAccountSchema = z.object({
  password: z.string().min(1, '비밀번호를 입력해주세요.'),
});

type DeleteAccountFormValues = z.infer<typeof DeleteAccountSchema>;

export default function MypageDeleteAccount() {
  const router = useRouter();
  const [message, setMessage] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<DeleteAccountFormValues>({
    resolver: zodResolver(DeleteAccountSchema),
  });

  const onSubmit = async (data: DeleteAccountFormValues) => {
    const token = getCookieValue('accessToken');
    if (!token) {
      alert('로그인이 필요합니다.');
      router.push('/front/account/login');
      return;
    }

    try {
      setMessage('');
      setErrorMsg('');

      const res = await fetch('/api/users/delete', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ password: data.password }),
      });

      const result = await res.json();

      if (!res.ok) {
        console.error('[회원 탈퇴 실패]', result);
        setErrorMsg(result.message || '회원 탈퇴 실패');
        return;
      }

      setMessage('회원 탈퇴가 완료되었습니다.');
      setTimeout(() => router.push('/'), 2000);
    } catch (error) {
      console.error('[회원 탈퇴 요청 오류]', error);
      setErrorMsg('서버 오류가 발생했습니다.');
    }
  };

  return (
    <div className="mypage-delete-page py-4 px-4 mt-20">
      <h2 className="text-2xl font-semibold mb-10 text-center">회원 탈퇴</h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="relative">
          <Input
            type="password"
            placeholder="비밀번호 입력"
            {...register('password')}
          />
          <p className="absolute top-[38px] left-0 mt-1 px-2 text-xs text-red-500">
            {errors.password?.message}
          </p>
        </div>

        <Button type="submit" className="w-full bg-red-600 text-white">
          탈퇴하기
        </Button>
      </form>

      {message && (
        <p className="mt-6 text-green-600 text-center font-semibold">
          {message}
        </p>
      )}
      {errorMsg && (
        <p className="mt-6 text-red-500 text-center font-semibold">
          {errorMsg}
        </p>
      )}
    </div>
  );
}
