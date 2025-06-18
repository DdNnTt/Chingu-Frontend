'use client';

import { usePathname } from 'next/navigation';
import Header from '../page';

export default function HeaderWrapper() {
  const pathname = usePathname();
  const hide = [
    '/',
    '/front/accout/login',
    '/front/accout/find-id',
    '/front/accout/find-pw',
    '/front/accout/change-pw',
    '/front/accout/signup',
  ].includes(pathname);

  return !hide ? <Header /> : null;
}
