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
    <html lang="en">
      <body>
        <HeaderWrapper />
        <main>{children}</main>
        <DockbarWrapper />
      </body>
    </html>
  );
}
