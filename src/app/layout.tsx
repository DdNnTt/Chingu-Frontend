'use client'; // 이거 꼭 필요합니다!

import '../styles/globals.css';
import '../styles/layout.css';
import Header from '@/front/components/layout/Header/page';
import { usePathname } from 'next/navigation';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  // 로그인, 회원가입 페이지에서 헤더 미노출
  const hideHeader =
    pathname === '/' ||
    pathname === '/front/accout/login' ||
    pathname === '/front/accout/find-id' ||
    pathname === '/front/accout/find-pw' ||
    pathname === '/front/accout/signup';

  return (
    <html lang="en">
      <body>
        {!hideHeader && <Header />}
        <main>{children}</main>
      </body>
    </html>
  );
}
