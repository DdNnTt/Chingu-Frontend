'use client';

import { usePathname } from 'next/navigation';
import Dockbar from '../page';

export default function DockbarWrapper() {
  const pathname = usePathname();

  const hideDockbarPages = [
    '/',
    '/front/account/login',
    '/front/account/find-id',
    '/front/account/find-pw',
    '/front/account/change-pw',
    '/front/account/signup',
  ];

  const shouldHideDockbar = hideDockbarPages.includes(pathname);

  return !shouldHideDockbar ? <Dockbar /> : null;
}
