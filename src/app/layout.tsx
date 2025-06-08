'use client';

import '../styles/globals.css';
import '../styles/layout.css';
import Header from '@/front/components/layout/Header/page';
import Dockbar from '@/front/components/layout/Dockbar/page';
import { usePathname } from 'next/navigation';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  // 로그인/회원가입 관련 페이지에서 헤더, 독바 미노출
  const authPages = [
    '/',
    '/front/accout/login',
    '/front/accout/find-id',
    '/front/accout/find-pw',
    '/front/accout/change-pw',
    '/front/accout/signup',
  ];

  const hideHeader = authPages.includes(pathname);
  const hideDockbar = authPages.includes(pathname);

  return (
    <html lang="en">
      <body>
        {!hideHeader && <Header />}
        <main>{children}</main>
        {!hideDockbar && <Dockbar />}
      </body>
    </html>
  );
}
