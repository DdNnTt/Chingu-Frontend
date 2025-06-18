'use client';

import { usePathname } from 'next/navigation';
import Dockbar from '../page';

export default function DockbarWrapper() {
  const pathname = usePathname();

  const hideDockbarPages = [
    '/',
    '/front/accout/login',
    '/front/accout/find-id',
    '/front/accout/find-pw',
    '/front/accout/change-pw',
    '/front/accout/signup',
  ];

  const shouldHideDockbar = hideDockbarPages.includes(pathname);

  return !shouldHideDockbar ? <Dockbar /> : null;
}
