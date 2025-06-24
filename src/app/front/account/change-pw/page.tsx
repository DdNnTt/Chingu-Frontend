import { Suspense } from 'react';
import ChangePasswordPage from './ChangePasswordPageClient';

export default function Page() {
  return (
    <Suspense fallback={<div>로딩 중...</div>}>
      <ChangePasswordPage />
    </Suspense>
  );
}
