'use client';

import { useState } from 'react';
import Input from '@/components/common/Input';
import {
  UseFormRegister,
  UseFormGetValues,
  UseFormSetValue,
  FieldValues,
  Path,
  PathValue,
} from 'react-hook-form';

type Props<T extends FieldValues> = {
  emailField: Path<T>; // 이메일 주소 필드
  codeField: Path<T>; // 인증번호 입력 필드
  register: UseFormRegister<T>;
  getValues: UseFormGetValues<T>;
  setValue: UseFormSetValue<T>;
  flagField: Path<T>; // 인증 완료 플래그 필드
};

export default function EmailVerificationInput<T extends FieldValues>({
  emailField,
  codeField,
  register,
  getValues,
  setValue,
  flagField,
}: Props<T>) {
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'success' | 'error'>(
    'success'
  );
  const [isSending, setIsSending] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [step, setStep] = useState<'idle' | 'sent' | 'verified'>('idle');

  // console.log('step 상태:', step);

  // 이메일 유효성 검사 함수 (간단한 정규식 사용)
  const isValidEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  // 인증번호 발송
  const handleSendVerificationCode = async () => {
    const email = getValues(emailField);

    if (!email) {
      setMessage('이메일을 입력해주세요.');
      return;
    }

    if (!isValidEmail(email)) {
      setMessage('올바른 이메일 형식을 입력해주세요.');
      return;
    }

    // 허용된 이메일 도메인인지 검사
    const allowedDomains = ['gmail.com', 'naver.com', 'daum.net'];
    const domain = email.split('@')[1];

    if (!allowedDomains.includes(domain)) {
      setMessage('허용되지 않은 이메일 도메인입니다.');
      setMessageType('error');
      return;
    }

    try {
      setIsSending(true);
      setMessage('');

      const response = await fetch(
        `/api/auth/email/verify?email=${encodeURIComponent(email)}`,
        {
          method: 'POST',
          credentials: 'include',
        }
      );

      const resultText = await response.text();

      if (response.status === 200) {
        setMessage('인증 이메일이 발송되었습니다.');
        setStep('sent');
      } else {
        setMessage(`오류: ${resultText}`);
      }
    } catch (error) {
      console.error(error);
      setMessage('서버 오류로 인증 메일을 보내지 못했습니다.');
      setMessageType('error');
    } finally {
      setIsSending(false);
    }
  };

  // 인증번호 검증
  const handleConfirmCode = async () => {
    const email = getValues(emailField);
    const code = getValues(codeField);

    if (!email || !code) {
      setMessage('이메일과 인증번호를 모두 입력해주세요.');
      setMessageType('error');
      return;
    }

    try {
      setIsVerifying(true);
      setMessage('');

      // 인증번호 확인 fetch
      const res = await fetch(
        `/api/auth/email/confirm?email=${encodeURIComponent(email)}&code=${encodeURIComponent(code)}`,
        {
          method: 'POST',
          credentials: 'include', // 여기도 필요
        }
      );

      const resultText = await res.text();

      if (res.status === 200) {
        setMessage('이메일 인증이 완료되었습니다.');
        setMessageType('success');
        setValue(flagField, true as PathValue<T, Path<T>>);
        setStep('verified');
      } else if (res.status === 400) {
        setMessage('인증번호가 올바르지 않거나 이메일 형식이 잘못되었습니다.');
        setMessageType('error');
      } else if (res.status === 404) {
        setMessage('해당 이메일 요청이 존재하지 않습니다.');
        setMessageType('error');
      } else {
        setMessage(`오류: ${resultText}`);
        setMessageType('error');
      }
    } catch (error) {
      console.error(error);
      setMessageType('error');
      setMessage('이메일 인증 중 오류가 발생했습니다.');
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div className="relative mb-6">
      {/* 이메일 입력 + 인증번호 발송 */}
      <div className="flex flex-btn items-center justify-center gap-1.5 mb-2">
        <Input
          type="email"
          placeholder="이메일을 입력하세요"
          {...register(emailField)}
          className="flex-1 px-3 py-2 border rounded-md"
        />
        <button
          type="button"
          onClick={handleSendVerificationCode}
          disabled={isSending || step === 'verified'}
          className="px-3 py-2 bg-gray-200 rounded-md text-sm"
        >
          {isSending
            ? '발송 중...'
            : step === 'verified'
              ? '발송 완료'
              : '인증번호 발송'}
        </button>
      </div>

      {/* 인증번호 입력 + 인증 확인 버튼 */}
      <div className="flex flex-btn items-center justify-center gap-1.5 mb-2">
        <Input
          type="text"
          placeholder="인증번호를 입력하세요"
          {...register(codeField)}
          className="flex-1 px-3 py-2 border rounded-md"
        />
        <button
          type="button"
          onClick={handleConfirmCode}
          disabled={isVerifying || step === 'verified'}
          className="px-3 py-2 bg-gray-200 rounded-md text-sm"
        >
          {isVerifying
            ? '확인 중...'
            : step === 'verified'
              ? '인증 완료'
              : '인증 확인'}
        </button>
      </div>

      {/* 메시지 */}
      {message && (
        <p
          className={`absolute top-[80px] left-0 mt-1 px-2 text-xs transition-opacity duration-200 ${
            messageType === 'success' ? 'main-color' : 'text-red-500'
          }`}
        >
          {message}
        </p>
      )}
    </div>
  );
}
