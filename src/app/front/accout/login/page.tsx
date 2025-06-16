'use client';

import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import Input from '@/components/common/Input';
import Button from '@/components/common/Button';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import axios from 'axios';

// Zod 스키마 정의
const LoginSchema = z.object({
  id: z.string().min(5, '아이디는 필수입니다'),
  password: z
    .string()
    .min(6, '비밀번호는 최소 6자 이상이어야 합니다')
    .max(20, '비밀번호는 최대 20자까지 입력 가능합니다'),
});

type LoginFormValues = z.infer<typeof LoginSchema>;

export default function Login() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(LoginSchema),
  });

  // 로그인 처리 로직
  const router = useRouter();
  const [loginError, setLoginError] = useState('');
  const [showAlert, setShowAlert] = useState(false);
  const [hideAlert, setHideAlert] = useState(false);

  useEffect(() => {
    if (loginError) {
      setShowAlert(true);
      setHideAlert(false);

      const hideTimer = setTimeout(() => {
        setHideAlert(true); // opacity 줄이기 시작
      }, 1000); // 1초 뒤에 사라지게 전환

      const removeTimer = setTimeout(() => {
        setShowAlert(false); // DOM 제거
      }, 1500); // fade-out 완료 후 제거

      return () => {
        clearTimeout(hideTimer);
        clearTimeout(removeTimer);
      };
    }
  }, [loginError]);

  const onSubmit = async (data: LoginFormValues) => {
    try {
      const response = await axios.post('/api/auth/login', {
        userId: data.id,
        password: data.password,
      });

      const { accessToken, tokenType } = response.data;

      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('tokenType', tokenType);

      router.push('/front/my-home');
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        const message = error.response?.data?.message;

        if (message === 'Bad credentials') {
          setShowAlert(false);
          setLoginError('');
          setTimeout(() => {
            setLoginError('아이디 또는 비밀번호를 확인해주세요.');
          }, 10);
        } else {
          setLoginError('서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
        }
      } else {
        setLoginError('알 수 없는 오류가 발생했습니다.');
      }
    }
  };

  return (
    <div className="login-page py-4 px-4 mt-20">
      <h2 className="text-2xl font-semibold mb-14 text-center">로그인</h2>

      {/* 알럿 메시지 */}
      {showAlert && (
        <div className={`cont-alert ${hideAlert ? 'hide' : ''}`}>
          {loginError}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)}>
        {/* 아이디 입력 */}
        <div className="relative mb-6">
          <Input
            type="text"
            placeholder="아이디를 입력하세요"
            {...register('id')}
          />
          <p
            className={`absolute top-[38px] left-0 mt-1 text-xs text-red-500 transition-opacity duration-200 ${
              errors.id ? 'opacity-100' : 'opacity-0'
            }`}
          >
            {errors.id?.message ?? ''}
          </p>
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

        {/* 링크 */}
        <div className="flex items-center justify-end mt-2">
          <Link
            href="/front/accout/find-id"
            className="text-sm max-w-fit px-2 text-center border-r border-[#000000]"
          >
            아이디 찾기
          </Link>
          <Link
            href="/front/accout/find-pw"
            className="text-sm max-w-fit px-2 text-center"
          >
            비밀번호 찾기
          </Link>
        </div>

        {/* 로그인 버튼 / 회원가입 */}
        <div className="flex items-center justify-center gap-1.5 mt-10">
          <Button
            type="submit"
            className="flex-1 w-full bg-blue-600 text-white"
          >
            로그인
          </Button>
          <Link
            href="signup"
            className="flex-1 bg-main-color text-white px-4 py-3 rounded-md w-full text-center"
          >
            회원가입
          </Link>
        </div>
      </form>

      {/* 소셜 로그인 */}
      <div className="social-login-wrap mt-28">
        <div className="border border-[#6845F5] text-sm px-2 py-2 rounded-md w-full text-center">
          Google 로그인
        </div>
        <div className="border border-[#6845F5] text-sm px-2 py-2 rounded-md w-full text-center mt-2">
          Kakao 로그인
        </div>
      </div>
    </div>
  );
}
