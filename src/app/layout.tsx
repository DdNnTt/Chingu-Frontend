import '../styles/globals.css';
import '../styles/layout.css';
import HeaderWrapper from '@/front/components/layout/Header/HeaderWrapper/page';
import DockbarWrapper from '@/front/components/layout/Dockbar/DockbarWrapper/page';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Chingu',
  description: '친구와 함께하는 소셜 플랫폼',
  icons: {
    icon: [
      { url: '/favicon.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon.png', sizes: '16x16', type: 'image/png' },
    ],
    shortcut: '/favicon.png',
    apple: '/favicon.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <head>
        <link rel="icon" href="/favicon.png" type="image/png" />
        <link rel="shortcut icon" href="/favicon.png" type="image/png" />
        <link rel="apple-touch-icon" href="/favicon.png" />
      </head>
      <body className="min-h-screen bg-gray-50">
        <div className="flex flex-col min-h-screen">
          <HeaderWrapper />
          <main className="flex-1">{children}</main>
          <DockbarWrapper />
        </div>
      </body>
    </html>
  );
}
