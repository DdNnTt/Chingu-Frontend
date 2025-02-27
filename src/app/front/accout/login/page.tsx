'use client';

import React, { useState } from 'react';
import Input from '../../../../components/common/Input';
import Button from '../../../../components/common/Button';
import Link from 'next/link';

export default function Login() {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // 로그인 처리 로직
    console.log({ id, password });
  };

  const [id, setId] = useState('');
  const [password, setPassword] = useState('');

  const handleIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setId(e.target.value);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  return (
    <div className="login-page py-4 px-4 mt-20">
      <h2 className="text-2xl font-semibold mb-14 text-center">로그인</h2>
      <form onSubmit={handleSubmit}>
        <Input
          label=""
          type="text"
          value={id}
          onChange={handleIdChange}
          placeholder="아이디를 입력하세요"
          required
        />
        <Input
          label=""
          type="password"
          value={password}
          onChange={handlePasswordChange}
          placeholder="비밀번호를 입력하세요"
          required
        />

        <div className="flex items-center justify-end">
          <Link
            href="find-id"
            className="text-sm max-w-fit px-2 text-center border-r border-[#000000]"
          >
            아이디 찾기
          </Link>
          <Link href="find-pw" className="text-sm max-w-fit px-2 text-center">
            비밀번호 찾기
          </Link>
        </div>

        <div className="flex items-center justify-center gap-1.5 mt-10">
          <Button
            type="submit"
            className="flex-1 w-full bg-blue-600 text-white"
          >
            로그인
          </Button>
          <Link
            href="signup"
            className="flex-1 bg-main-color text-white px-4 py-3 rounded w-full text-center"
          >
            회원가입
          </Link>
        </div>
      </form>
      <div className="social-login-wrap mt-28">
        <div className="border border-[#6845F5] text-sm px-2 py-2 rounded w-full text-center">
          Google 로그인
        </div>
        <div className="border border-[#6845F5] text-sm px-2 py-2 rounded w-full text-center mt-2">
          Kakao 로그인
        </div>
      </div>
    </div>
  );
}
