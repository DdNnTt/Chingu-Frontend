'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Users, UserCircle, Mail } from 'lucide-react';

export default function Dockbar() {
  const pathname = usePathname();

  // console.log('📍 current pathname:', pathname); // ← 확인용

  const items = [
    { href: '/front/my-home', label: '마이홈', icon: <Home size={20} /> },
    {
      href: '/front/my-home/group-list',
      label: '그룹',
      icon: <Users size={20} />,
      isActive:
        pathname.includes('/front/my-home/group') ||
        pathname.includes('/front/my-home/member'),
    },
    {
      href: '/front/my-page',
      label: '마이페이지',
      icon: <UserCircle size={20} />,
    },
    { href: '/front/message/list', label: '쪽지', icon: <Mail size={20} /> },
  ];

  return (
    <div className="dockbar absolute bottom-0 left-0 right-0 bg-[rgba(232,227,255)] px-4 py-3 shadow-md z-50 rounded-b-md">
      <nav className="flex justify-around text-center text-sm text-black">
        {items.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`flex flex-col items-center gap-1 ${
              item.isActive || pathname === item.href ? 'text-[#aa96fc]' : ''
            }`}
          >
            {item.icon}
            <span className="text-xs">{item.label}</span>
          </Link>
        ))}
      </nav>
    </div>
  );
}
