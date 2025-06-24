import { Suspense } from 'react';
import MypageChangePwClient from './MypageChangePwClient.tsx';

export default function Page() {
  return (
    <Suspense fallback={<div>로딩 중...</div>}>
      <MypageChangePwClient />
    </Suspense>
  );
}
