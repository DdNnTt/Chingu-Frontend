import '../styles/globals.css';
import '../styles/layout.css';
import HeaderWrapper from '@/front/components/layout/Header/HeaderWrapper/page';
import DockbarWrapper from '@/front/components/layout/Dockbar/DockbarWrapper/page';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
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
