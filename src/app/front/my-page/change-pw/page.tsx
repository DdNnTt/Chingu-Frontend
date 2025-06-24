import dynamic from 'next/dynamic';
import { Suspense } from 'react';

// 클라이언트 컴포넌트를 dynamic import
const MypageChangePw = dynamic(() => import('./MypageChangePwClient.tsx'), {
  ssr: false,
});

export default function ChangePwPage() {
  return (
    <Suspense fallback={<div>로딩 중입니다...</div>}>
      <MypageChangePw />
    </Suspense>
  );
}
