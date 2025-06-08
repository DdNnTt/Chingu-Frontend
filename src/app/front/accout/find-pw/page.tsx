'use client';

import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import Button from '@/components/common/Button';
import { useRouter } from 'next/navigation';
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
      `/front/accout/change-pw?email=${encodeURIComponent(data.email)}`
    );
  };

  return (
    <div className="find-password-page py-4 px-4 mt-20">
      <h2 className="text-2xl font-semibold mb-14 text-center">
        비밀번호 찾기
      </h2>

      <form onSubmit={handleSubmit(onSubmit)}>
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

        <Button type="submit" className="w-full bg-blue-600 text-white">
          확인
        </Button>
      </form>
    </div>
  );
}
