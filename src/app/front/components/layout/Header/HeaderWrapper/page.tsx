'use client';

import { usePathname } from 'next/navigation';
import Header from '../page';

export default function HeaderWrapper() {
  const pathname = usePathname();
  const hide = [
    '/',
    '/front/account/login',
    '/front/account/find-id',
    '/front/account/find-pw',
    '/front/account/change-pw',
    '/front/account/signup',
  ].includes(pathname);

  return !hide ? <Header /> : null;
}
