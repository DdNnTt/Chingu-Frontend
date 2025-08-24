'use client';

import { useState } from 'react';
import React from 'react';
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
  name: Path<T>;
  placeholder: string;
  checkUrl: string;
  queryKey: string;
  successMessage: string;
  failureMessage: string;
  register: UseFormRegister<T>;
  getValues: UseFormGetValues<T>;
  setValue: UseFormSetValue<T>;
  flagField: Path<T>;
};

export default function CheckableInput<T extends FieldValues>({
  name,
  placeholder,
  checkUrl,
  queryKey,
  successMessage,
  failureMessage,
  register,
  getValues,
  setValue,
  flagField,
}: Props<T>) {
  const [isChecking, setIsChecking] = useState(false);
  const [isAvailable, setIsAvailable] = useState<boolean | null>(null);
  const [message, setMessage] = useState('');

  const handleCheck = async () => {
    const value = getValues(name as Path<T>).trim();

    if (!value) {
      setMessage('입력값을 작성해주세요.');
      setIsAvailable(null);
      return;
    }

    setIsChecking(true);
    setMessage('');

    try {
      const response = await fetch(
        `${checkUrl}?${queryKey}=${encodeURIComponent(value)}`
      );
      const result = await response.json();

      if (!response.ok) {
        throw new Error(`서버 오류: ${response.status}`);
      }

      if (result === true) {
        setIsAvailable(true);
        setMessage(successMessage);
        setValue(flagField, true as PathValue<T, Path<T>>);
      } else {
        setIsAvailable(false);
        setMessage(failureMessage);
        setValue(flagField, false as PathValue<T, Path<T>>);
      }
    } catch (err) {
      console.error('중복 확인 에러:', err);
      setIsAvailable(null);
      setMessage('중복 확인 중 오류가 발생했습니다.');
    } finally {
      setIsChecking(false);
    }
  };

  return (
    <div className="relative mb-6">
      <div className="flex flex-btn items-center justify-center gap-1.5">
        <Input
          type="text"
          placeholder={placeholder}
          autoComplete="off"
          {...register(name as Path<T>)}
          className="flex-1 h-10 px-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-200"
          style={
            {
              '--focus-ring-color': '#6845f5',
            } as React.CSSProperties
          }
          onFocus={(e) => {
            e.currentTarget.style.boxShadow = '0 0 0 2px #6845f5';
          }}
          onBlur={(e) => {
            e.currentTarget.style.boxShadow = '';
          }}
        />
        <button
          type="button"
          onClick={handleCheck}
          disabled={isChecking}
          className="h-10 px-4 bg-main-color text-white rounded-xl text-sm font-medium shadow-sm hover:shadow-md hover:bg-sub-color transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {/* {isChecking ? '확인 중...' : '중복 확인'} */}
          중복 확인
        </button>
      </div>
      {message && (
        <p
          className={`absolute top-[38px] left-0 mt-1 px-2 text-xs transition-opacity duration-200 ${
            isAvailable === true
              ? 'main-color'
              : isAvailable === false
                ? 'text-red-500'
                : ''
          }`}
        >
          {message}
        </p>
      )}
    </div>
  );
}
