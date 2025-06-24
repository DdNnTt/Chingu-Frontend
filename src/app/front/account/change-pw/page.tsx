import { Suspense } from 'react';
import MypageChangePwClient from './ChangePasswordPageClient';

export default function Page() {
  return (
    <Suspense fallback={<div>로딩 중...</div>}>
      <MypageChangePwClient />
    </Suspense>
  );
}
