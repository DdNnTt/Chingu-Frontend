'use client';

import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import Input from '@/components/common/Input';
import Button from '@/components/common/Button';
import { useState } from 'react';
import axios from 'axios';

const FindIdSchema = z.object({
  name: z.string().min(1, '이름을 입력해주세요'),
  email: z.string().email('유효한 이메일을 입력해주세요'),
});

type FindIdFormValues = z.infer<typeof FindIdSchema>;

export default function FindIdPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FindIdFormValues>({
    resolver: zodResolver(FindIdSchema),
  });

  const [foundId, setFoundId] = useState<string | null>(null);
  const [error, setError] = useState('');

  const onSubmit = async (data: FindIdFormValues) => {
    try {
      setError('');
      setFoundId(null);

      const response = await axios.get('/api/auth/find-id', {
        params: {
          name: data.name,
          email: data.email,
        },
      });

      if (response.data?.userId) {
        setFoundId(response.data.userId);
      } else {
        setError(response.data?.message || '일치하는 정보가 없습니다.');
      }
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || '아이디 찾기 실패');
      } else {
        setError('예상치 못한 오류가 발생했습니다.');
      }
    }
  };

  return (
    <div className="find-id-page py-4 px-4 mt-20">
      <h2 className="text-2xl font-semibold mb-14 text-center">아이디 찾기</h2>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="relative mb-6">
          <Input
            type="text"
            placeholder="이름을 입력하세요"
            {...register('name')}
          />
          <p className="text-xs text-red-500 mt-1">
            {errors.name?.message ?? ''}
          </p>
        </div>

        <div className="relative mb-6">
          <Input
            type="email"
            placeholder="이메일을 입력하세요"
            {...register('email')}
          />
          <p className="text-xs text-red-500 mt-1">
            {errors.email?.message ?? ''}
          </p>
        </div>

        <Button type="submit" className="w-full bg-blue-600 text-white">
          아이디 찾기
        </Button>
      </form>

      {foundId && (
        <p className="mt-6 text-green-600 text-center font-semibold">
          회원님의 아이디는 <strong>{foundId}</strong>입니다.
        </p>
      )}

      {error && <p className="mt-6 text-red-500 text-center">{error}</p>}
    </div>
  );
}
