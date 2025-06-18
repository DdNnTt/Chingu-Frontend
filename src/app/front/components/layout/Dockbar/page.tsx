'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Users, UserCircle, Mail } from 'lucide-react';

export default function Dockbar() {
  const pathname = usePathname();

  const items = [
    { href: '/front/my-home', label: '마이홈', icon: <Home size={20} /> },
    {
      href: '/front/my-home/group-list',
      label: '그룹',
      icon: <Users size={20} />,
    },
    {
      href: '/front/my-page',
      label: '마이페이지',
      icon: <UserCircle size={20} />,
    },
    { href: '/front/message', label: '쪽지', icon: <Mail size={20} /> },
  ];

  return (
    <div className="dockbar absolute bottom-0 left-0 right-0 bg-[rgba(104,69,245,0.1)] px-4 py-3 shadow-md z-50 rounded-b-md">
      <nav className="flex justify-around text-center text-sm text-black">
        {items.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`flex flex-col items-center gap-1 ${pathname === item.href ? 'text-[#aa96fc]' : ''}`}
          >
            {item.icon}
            <span className="text-xs">{item.label}</span>
          </Link>
        ))}
      </nav>
    </div>
  );
}
