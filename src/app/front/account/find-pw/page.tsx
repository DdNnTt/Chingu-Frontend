'use client';

import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import Button from '@/components/common/Button';
import { useRouter } from 'next/navigation';
import React from 'react';
import EmailVerificationInput from '@/components/common/EmailVerificationInput'; // ✅ 컴포넌트 import

// ✅ Zod 스키마 정의
const FindPwSchema = z.object({
  email: z.string().email('유효한 이메일을 입력해주세요'),
  confirmCode: z.string().min(1, '인증번호를 입력해주세요'),
  emailVerified: z.boolean().refine((val) => val === true, {
    message: '이메일 인증을 완료해주세요.',
  }),
});

type FindPwFormValues = z.infer<typeof FindPwSchema>;

export default function FindPasswordPage() {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    getValues,
    setValue,
    formState: { errors },
  } = useForm<FindPwFormValues>({
    resolver: zodResolver(FindPwSchema),
    defaultValues: {
      emailVerified: false,
    },
  });

  const onSubmit = async (data: FindPwFormValues) => {
    if (!data.emailVerified) return;

    router.push(
      `/front/account/change-pw?email=${encodeURIComponent(data.email)}&code=${encodeURIComponent(data.confirmCode)}`
    );
  };

  return (
    <div
      className="find-password-page relative h-full flex flex-col items-center justify-center overflow-hidden tracking-tight py-4 px-4"
      style={{ letterSpacing: '-0.5px' }}
    >
      {/* 배경 그라데이션 */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100"></div>

      {/* 애니메이션 배경 요소들 */}
      <div className="absolute top-10 left-6 w-32 h-32 bg-purple-200 rounded-full opacity-30 animate-pulse"></div>
      <div className="absolute bottom-10 right-8 w-24 h-24 bg-blue-200 rounded-full opacity-40 animate-pulse delay-1000"></div>
      <div className="absolute top-1/3 right-0 w-16 h-16 bg-pink-200 rounded-full opacity-30 animate-pulse delay-700"></div>
      <div className="absolute bottom-1/4 left-0 w-20 h-20 bg-indigo-200 rounded-full opacity-20 animate-pulse delay-500"></div>
      <div
        className="absolute top-1/2 left-1/2 w-12 h-12 bg-yellow-100 rounded-full opacity-20 animate-pulse delay-300"
        style={{ transform: 'translate(-50%, -50%)' }}
      ></div>

      {/* 메인 컨텐츠 */}
      <div className="relative z-10 w-full max-w-sm mx-auto">
        {/* 헤더 */}
        <div className="text-center space-y-4 mb-12 animate-slideUp opacity-0">
          <h2 className="text-3xl text-black drop-shadow-sm font-bold">
            비밀번호 찾기
          </h2>
        </div>

        {/* 비밀번호 찾기 폼 */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="animate-slideUp delay-300 opacity-0"
        >
          {/* ✅ 이메일 인증 컴포넌트 통합 */}
          <EmailVerificationInput<FindPwFormValues>
            emailField="email"
            codeField="confirmCode"
            register={register}
            getValues={getValues}
            setValue={setValue}
            flagField="emailVerified"
          />

          {/* 이메일 인증이 안 되었을 경우 표시 */}
          {errors.emailVerified && (
            <p className="text-xs text-red-500 mb-4 text-center">
              {errors.emailVerified.message}
            </p>
          )}

          <div className="animate-slideUp delay-600 opacity-0">
            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-purple-500 to-blue-500 text-white px-4 py-3 rounded-xl font-medium shadow-lg hover:shadow-xl hover:from-purple-600 hover:to-blue-600 transition-all duration-300"
            >
              확인
            </Button>
          </div>
        </form>

        {/* 홈으로 이동 버튼 */}
        <div className="mt-6 text-center animate-slideUp delay-900 opacity-0">
          <Button
            type="button"
            onClick={() => router.push('/front/account/login')}
            className="w-full bg-gradient-to-r from-gray-500 to-gray-600 text-white px-4 py-3 rounded-xl font-medium shadow-lg hover:shadow-xl hover:from-gray-600 hover:to-gray-700 transition-all duration-300"
          >
            홈으로 돌아가기
          </Button>
        </div>
      </div>
    </div>
  );
}
