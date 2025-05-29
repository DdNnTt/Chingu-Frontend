'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import Input from '@/components/common/Input';
import CheckableInput from '@/components/common/CheckableInput';
import Button from '@/components/common/Button';
import Link from 'next/link';
import EmailVerificationInput from '@/components/common/EmailVerificationInput';

// Zod 스키마 정의
const SignUpSchema = z
  .object({
    name: z.string().min(1, '이름을 입력해주세요'),
    userId: z.string().min(4, '아이디는 4자 이상이어야 합니다'),
    userNickname: z.string().min(2, '닉네임은 2자 이상이어야 합니다'),
    email: z
      .string()
      .min(5, '이메일은 필수입니다')
      .email('유효한 이메일을 입력해주세요'),
    confirmCode: z.string().min(1, '인증번호를 입력해주세요'),
    password: z
      .string()
      .min(6, '비밀번호는 최소 6자 이상이어야 합니다')
      .max(20, '비밀번호는 최대 20자까지 입력 가능합니다'),
    confirmPassword: z.string().min(1, '비밀번호 확인은 필수입니다'),
    isUserIdChecked: z.literal(true).refine((val) => val === true, {
      message: '아이디 중복 확인을 해주세요',
    }),
    isNicknameChecked: z.literal(true).refine((val) => val === true, {
      message: '닉네임 중복 확인을 해주세요',
    }),
    emailVerified: z.literal(true).refine((val) => val === true, {
      message: '이메일 인증을 완료해주세요',
    }),
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
    setValue,
    formState: { errors },
  } = useForm<SignUpFormValues>({
    resolver: zodResolver(SignUpSchema),
    defaultValues: {
      isUserIdChecked: true,
      isNicknameChecked: true,
      emailVerified: true,
    },
  });

  const password = watch('password');
  const confirmPassword = watch('confirmPassword');
  const isPasswordMatch =
    password && confirmPassword && password === confirmPassword;

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
          <Input
            type="text"
            placeholder="이름을 입력하세요"
            {...register('name')}
          />
          <p
            className={`absolute top-[38px] left-0 mt-1 px-2 text-xs text-red-500 transition-opacity duration-200 ${
              errors.name ? 'opacity-100' : 'opacity-0'
            }`}
          >
            {errors.name?.message ?? ''}
          </p>
        </div>

        {/* 아이디 입력 - 중복 확인 api */}
        <CheckableInput<SignUpFormValues>
          name="userId"
          placeholder="아이디를 입력하세요"
          checkUrl="/api/users/check-userId"
          queryKey="userId"
          successMessage="사용 가능한 아이디입니다."
          failureMessage="이미 사용 중인 아이디입니다."
          register={register}
          getValues={getValues}
          setValue={setValue}
          flagField="isUserIdChecked"
        />

        {/* 비밀번호 입력 */}
        <div className="relative mb-6">
          <Input
            type="password"
            placeholder="비밀번호를 입력하세요"
            {...register('password')}
          />
          <p
            className={`absolute top-[38px] left-0 mt-1 px-2 text-xs text-red-500 transition-opacity duration-200 ${
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
            <p className="absolute top-[38px] left-0 mt-1 px-2 text-xs text-red-500 transition-opacity duration-200 opacity-100">
              {errors.confirmPassword.message}
            </p>
          )}
          {/* 성공 메시지 */}
          {!errors.confirmPassword && isPasswordMatch && (
            <p className="absolute top-[38px] left-0 mt-1 px-2 text-xs main-color transition-opacity duration-200 opacity-100">
              비밀번호가 일치합니다
            </p>
          )}
        </div>

        {/* 이메일 입력 및 인증 */}
        <EmailVerificationInput<SignUpFormValues>
          emailField="email"
          codeField="confirmCode" // 폼에 추가해야 함
          register={register}
          getValues={getValues}
          setValue={setValue}
          flagField="emailVerified"
        />

        {/* 닉네임 입력 */}
        <CheckableInput<SignUpFormValues>
          name="userNickname"
          placeholder="닉네임을 입력하세요"
          checkUrl="/api/users/check-nickname"
          queryKey="nickname"
          successMessage="사용 가능한 닉네임입니다."
          failureMessage="이미 사용 중인 닉네임입니다."
          register={register}
          getValues={getValues}
          setValue={setValue}
          flagField="isNicknameChecked"
        />

        {/* 취소 버튼 / 회원가입 */}
        <div className="flex items-center justify-center gap-1.5 mt-10">
          <Link
            href="/front/accout/login"
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
