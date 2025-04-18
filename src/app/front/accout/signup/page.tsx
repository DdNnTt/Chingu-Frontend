'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import Input from '@/components/common/Input';
import Button from '@/components/common/Button';
import Link from 'next/link';

// Zod 스키마 정의
const SignUpSchema = z
  .object({
    userId: z.string().min(4, '아이디는 4자 이상이어야 합니다'),
    email: z.string().min(5, '이메일은 필수입니다'),
    password: z
      .string()
      .min(6, '비밀번호는 최소 6자 이상이어야 합니다')
      .max(20, '비밀번호는 최대 20자까지 입력 가능합니다'),
    confirmPassword: z.string().min(1, '비밀번호 확인은 필수입니다'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ['confirmPassword'],
    message: '비밀번호가 일치하지 않습니다',
  });

type SignUpFormValues = z.infer<typeof SignUpSchema>;

export default function Signup() {
  const {
    register,
    handleSubmit,
    getValues,
    watch,
    formState: { errors },
  } = useForm<SignUpFormValues>({
    resolver: zodResolver(SignUpSchema),
  });

  const [isChecking, setIsChecking] = useState(false);
  const [isAvailable, setIsAvailable] = useState<boolean | null>(null);
  const [checkMessage, setCheckMessage] = useState('');

  const password = watch('password');
  const confirmPassword = watch('confirmPassword');
  const isPasswordMatch =
    password && confirmPassword && password === confirmPassword;

  const handleCheckUsername = async () => {
    const userId = getValues('userId');
    if (!userId) {
      setCheckMessage('아이디를 입력해주세요.');
      setIsAvailable(null);
      return;
    }

    setIsChecking(true);
    setCheckMessage('');
    try {
      const response = await fetch(
        `http://3.34.181.113:8080/v1/users/check-userid?userId=${userId}`
      );
      if (!response.ok) {
        throw new Error('서버 응답 오류');
      }
      const result = await response.json();

      if (result.isAvailable) {
        setIsAvailable(true);
        setCheckMessage('사용 가능한 아이디입니다.');
      } else {
        setIsAvailable(false);
        setCheckMessage('이미 사용 중인 아이디입니다.');
      }
    } catch (err) {
      console.error(err);
      setIsAvailable(null);
      setCheckMessage('중복 확인 중 오류가 발생했습니다.');
    } finally {
      setIsChecking(false);
    }
  };

  // 회원가입 처리 로직
  const onSubmit = (data: SignUpFormValues) => {
    console.log(data);
  };

  return (
    <div className="signup-page py-4 px-4 mt-20">
      <h2 className="text-2xl font-semibold mb-14 text-center">회원가입</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        {/* 이름 입력 (선택) */}
        <div className="relative mb-6">
          <Input type="text" placeholder="이름을 입력하세요" />
        </div>

        {/* 아이디 입력 - 중복 확인 api */}
        <div className="relative mb-6">
          <div className="flex flex-btn items-center justify-center gap-1.5">
            <Input type="text" placeholder="아이디를 입력하세요" />
            <button
              type="button"
              onClick={handleCheckUsername}
              className="px-3 py-2 bg-gray-200 rounded-md text-sm"
              disabled={isChecking}
            >
              {isChecking ? '확인 중...' : '중복 확인'}
            </button>
          </div>
          {checkMessage && (
            <p
              className={`absolute top-[38px] left-0 mt-1 text-xs text-red-500 transition-opacity duration-200 mt-1 text-xs ${
                isAvailable === true
                  ? 'main-color'
                  : isAvailable === false
                    ? 'point2-color'
                    : 'point2-color'
              }`}
            >
              {checkMessage}
            </p>
          )}
        </div>

        {/* 비밀번호 입력 */}
        <div className="relative mb-6">
          <Input
            type="password"
            placeholder="비밀번호를 입력하세요"
            {...register('password')}
          />
          <p
            className={`absolute top-[38px] left-0 mt-1 text-xs text-red-500 transition-opacity duration-200 ${
              errors.password ? 'opacity-100' : 'opacity-0'
            }`}
          >
            {errors.password?.message ?? ''}
          </p>
        </div>

        {/* 비밀번호 확인 입력 */}
        <div className="relative mb-6">
          <Input
            type="password"
            placeholder="비밀번호를 다시 입력하세요"
            {...register('confirmPassword')}
          />
          {/* 오류 메시지 */}
          {errors.confirmPassword && (
            <p className="absolute top-[38px] left-0 mt-1 text-xs text-red-500 transition-opacity duration-200 opacity-100">
              {errors.confirmPassword.message}
            </p>
          )}
          {/* 성공 메시지 */}
          {!errors.confirmPassword && isPasswordMatch && (
            <p className="absolute top-[38px] left-0 mt-1 text-xs main-color transition-opacity duration-200 opacity-100">
              비밀번호가 일치합니다
            </p>
          )}
        </div>

        {/* 이메일 입력 */}
        <div className="relative mb-6">
          <div className="flex flex-btn items-center justify-center gap-1.5 mb-2">
            <Input type="email" placeholder="이메일을 입력하세요" />
            <button
              type="button"
              // onClick={handleCheckUsername}
              className="px-3 py-2 bg-gray-200 rounded-md text-sm"
              disabled={isChecking}
            >
              인증 번호 발송
            </button>
          </div>
          <Input type="text" placeholder="인증번호를 입력하세요" />
          <p
            className={`absolute top-[38px] left-0 mt-1 text-xs text-red-500 transition-opacity duration-200`}
          ></p>
        </div>

        {/* 닉네임 입력 */}
        <div className="relative mb-6">
          <div className="flex flex-btn items-center justify-center gap-1.5">
            <Input type="text" placeholder="닉네임을 입력하세요" />
            <button
              type="button"
              // onClick={handleCheckUsername}
              className="px-3 py-2 bg-gray-200 rounded-md text-sm"
              disabled={isChecking}
            >
              {isChecking ? '확인 중...' : '중복 확인'}
            </button>
          </div>

          <p
            className={`absolute top-[38px] left-0 mt-1 text-xs text-red-500 transition-opacity duration-200`}
          ></p>
        </div>

        {/* 취소 버튼 / 회원가입 */}
        <div className="flex items-center justify-center gap-1.5 mt-10">
          <Link
            href="login"
            className="flex-1 bg-main-color text-white px-4 py-3 rounded-md w-full text-center"
          >
            취소
          </Link>
          <Button
            type="submit"
            className="flex-1 w-full bg-blue-600 text-white"
          >
            회원가입
          </Button>
        </div>
      </form>
    </div>
  );
}
