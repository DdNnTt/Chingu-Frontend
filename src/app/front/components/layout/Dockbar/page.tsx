'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Users, UserCircle, Mail } from 'lucide-react';

export default function Dockbar() {
  const pathname = usePathname();

  // console.log('📍 current pathname:', pathname); // ← 확인용

  const items = [
    { href: '/front/my-home', label: '마이홈', icon: <Home size={17} /> },
    {
      href: '/front/my-home/group-list',
      label: '그룹',
      icon: <Users size={17} />,
      isActive:
        pathname.includes('/front/my-home/group') ||
        pathname.includes('/front/my-home/member'),
    },
    {
      href: '/front/my-page',
      label: '마이페이지',
      icon: <UserCircle size={17} />,
    },
    { href: '/front/message/list', label: '쪽지', icon: <Mail size={17} /> },
  ];

  return (
    <div className="dockbar absolute bottom-0 left-0 right-0 h-[70px] bg-gradient-to-t from-white via-purple-50 to-blue-50 backdrop-blur-md border-t border-purple-100 px-4 shadow-lg hover:shadow-xl z-50 flex items-center transition-all duration-300">
      <nav className="flex justify-around text-center text-sm w-full">
        {items.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`flex flex-col items-center justify-center gap-1 w-[50px] h-[50px] rounded-xl transition-all duration-300 relative group ${
              item.isActive || pathname === item.href
                ? 'text-white bg-gradient-to-br from-purple-500 to-blue-500 shadow-lg transform scale-105'
                : 'text-gray-600 hover:text-purple-600 hover:bg-white hover:bg-opacity-80 hover:shadow-lg hover:scale-110 active:scale-95'
            }`}
          >
            {/* 리플 효과 */}
            <div className="absolute inset-0 rounded-xl overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-blue-400 opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
            </div>

            {/* 아이콘 */}
            <div
              className={`transition-all duration-300 relative z-10 ${
                item.isActive || pathname === item.href
                  ? 'scale-110 drop-shadow-sm'
                  : 'group-hover:scale-125 group-hover:rotate-12 group-active:rotate-0'
              }`}
            >
              {item.icon}
            </div>

            {/* 텍스트 */}
            <span
              className={`text-[10px] font-medium relative z-10 transition-all duration-300 ${
                item.isActive || pathname === item.href
                  ? 'drop-shadow-sm'
                  : 'group-hover:scale-105'
              }`}
            >
              {item.label}
            </span>
          </Link>
        ))}
      </nav>
    </div>
  );
}
