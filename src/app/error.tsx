'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import Button from '@/components/common/Button';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="error-page py-4 px-4 h-full flex flex-col items-center justify-center">
      <h2 className="hakgyo-black text-6xl main-color animate-slideUp opacity-0">
        Oops!
      </h2>
      <h3 className="mt-4 text-xl font-bold animate-slideUp delay-400 opacity-0">
        문제가 발생했어요
      </h3>
      <p className="mt-4 text-center animate-slideUp delay-800 opacity-0">
        잠시 후 다시 시도해주세요
        <br />
        문제가 지속되면 관리자에게 문의해주세요
      </p>
      <div className="flex gap-4 w-full mt-20">
        <Button
          onClick={reset}
          className="w-1/2 animate-slideUp delay-1200 opacity-0"
        >
          다시 시도하기
        </Button>
        <Link href="/" className="w-1/2">
          <Button
            variant="secondary"
            className="w-full animate-slideUp delay-1200 opacity-0"
          >
            홈으로 가기
          </Button>
        </Link>
      </div>
    </div>
  );
}
