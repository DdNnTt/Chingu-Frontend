"use client";

import React, { useState } from 'react';
import Input from "../../../../components/common/Input";
import Button from "../../../../components/common/Button";

export default function Login() {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // 회원가입 처리 로직
    console.log({ email, password, confirmPassword });
  };

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const handleConfirmPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setConfirmPassword(e.target.value);
  };

  return (
    <div className="py-4 px-4">
      <h2 className="text-2xl font-semibold mb-4">회원가입</h2>
      <form onSubmit={handleSubmit}>
        <Input label="이메일" type="email" value={email} onChange={handleEmailChange} placeholder="이메일을 입력하세요" required />
        <Input label="비밀번호" type="password" value={password} onChange={handlePasswordChange} placeholder="비밀번호를 입력하세요" required />
        <Input label="비밀번호 확인" type="password" value={confirmPassword} onChange={handleConfirmPasswordChange} placeholder="비밀번호를 다시 입력하세요" required />
        <Button type="submit" className="w-full mt-4 bg-blue-600 text-white">
          회원가입
        </Button>
      </form>
    </div>
  );
}