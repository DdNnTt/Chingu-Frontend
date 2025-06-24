'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import Input from '@/components/common/Input';
import Button from '@/components/common/Button';
import { useState, useEffect } from 'react';
import axios from 'axios'; // (에러 발생)원본으로 하는 이유: 원본 axios에서 정적 메서드 사용 가능 / 요청 보낼 때는 @/libs/axios 사용 가능

const ChangePwSchema = z
  .object({
    newPassword: z.string().min(6, '새 비밀번호는 최소 6자 이상이어야 합니다.'),
    confirmPassword: z.string().min(6, '비밀번호 확인은 필수입니다.'),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: '비밀번호가 일치하지 않습니다.',
    path: ['confirmPassword'],
  });

type ChangePwFormValues = z.infer<typeof ChangePwSchema>;

export default function ChangePasswordPage() {
  const searchParams = useSearchParams();
  const email = searchParams.get('email');
  const code = searchParams.get('code');
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ChangePwFormValues>({
    resolver: zodResolver(ChangePwSchema),
  });

  const [message, setMessage] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (!email || !code) {
      alert('잘못된 접근입니다. 이메일 인증을 다시 진행해주세요.');
      router.replace('/front/account/find-pw');
    }
  }, [email, code, router]);

  const onSubmit = async (data: ChangePwFormValues) => {
    try {
      setMessage('');
      setErrorMsg('');

      const res = await axios.post('/api/auth/email/password/reset', {
        email,
        newPassword: data.newPassword,
        code, // ✅ 인증번호도 함께 전송
      });

      setMessage(res.data?.message || '비밀번호가 변경되었습니다.');
      setTimeout(() => router.push('/front/account/login'), 2000);
    } catch (err: unknown) {
      console.error('[비밀번호 변경 오류]', err);
      if (axios.isAxiosError(err)) {
        setErrorMsg(err.response?.data?.message || '비밀번호 변경 실패');
      } else {
        setErrorMsg('알 수 없는 오류가 발생했습니다.');
      }
    }
  };

  return (
    <div className="change-password-page py-4 px-4 mt-20">
      <h2 className="text-2xl font-semibold mb-10 text-center">
        새 비밀번호 설정
      </h2>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-6">
          <Input
            type="password"
            placeholder="새 비밀번호"
            {...register('newPassword')}
          />
          <p className="text-xs text-red-500 mt-1">
            {errors.newPassword?.message ?? ''}
          </p>
        </div>

        <div className="mb-6">
          <Input
            type="password"
            placeholder="새 비밀번호 확인"
            {...register('confirmPassword')}
          />
          <p className="text-xs text-red-500 mt-1">
            {errors.confirmPassword?.message ?? ''}
          </p>
        </div>

        <Button type="submit" className="w-full bg-blue-600 text-white">
          확인
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
