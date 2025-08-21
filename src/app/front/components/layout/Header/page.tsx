'use client';

import { useRouter, usePathname } from 'next/navigation';
import { useState } from 'react';
import React from 'react';
import { Search } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import Input from '@/components/common/Input';

export default function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const isSearchPage = pathname === '/front/search';

  const [searchQuery, setSearchQuery] = useState('');

  // 로그아웃
  const handleLogout = () => {
    document.cookie =
      'accessToken=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    alert('다음에 또 만나요 👋');
    router.replace('/front/account/login');
  };

  // 유저 검색
  const handleSearch = () => {
    if (!searchQuery.trim()) return;
    router.push(`/front/search?keyword=${encodeURIComponent(searchQuery)}`);
  };

  // 폼 제출 핸들러
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    handleSearch();
  };

  return (
    <header className="absolute top-0 w-full z-50 bg-gradient-to-b from-white via-purple-50 to-blue-50 backdrop-blur-md border-b border-purple-100 shadow-sm hover:shadow-md px-4 py-3 flex justify-between items-center transition-all duration-300">
      {/* 로고 */}
      <Link
        href="/front/my-home"
        className="text-xl font-bold text-main-color hover:text-sub-color transition-all duration-300 hover:scale-110 transform"
      >
        <Image
          src="/images/ch-logo.webp"
          alt="캐릭터 로고 사진"
          width={20}
          height={20}
          className="object-cover transition-transform duration-300 hover:rotate-12"
        />
      </Link>

      <div className="flex items-center gap-2">
        {isSearchPage ? (
          <form onSubmit={handleSubmit} className="flex items-center gap-2">
            <Input
              type="text"
              placeholder="검색어 입력"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-40 py-2 text-sm border border-purple-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white bg-opacity-80 backdrop-blur-sm transition-all duration-200"
            />
            <button
              type="submit"
              className="text-main-color hover:text-sub-color p-2 rounded-xl hover:bg-white hover:bg-opacity-60 hover:shadow-sm transition-all duration-300 hover:scale-110 active:scale-95"
            >
              <Search size={18} />
            </button>
          </form>
        ) : (
          <button
            type="button"
            className="text-gray-700 hover:text-main-color p-2 rounded-xl hover:bg-white hover:bg-opacity-60 hover:shadow-sm transition-all duration-300 hover:scale-110 active:scale-95"
            onClick={() => router.push('/front/search')}
          >
            <Search size={18} />
          </button>
        )}

        {/* 로그아웃 */}
        <button
          onClick={handleLogout}
          className="text-xs text-gray-700 bg-white bg-opacity-80 border border-purple-200 px-3 py-1.5 rounded-lg font-medium shadow-sm hover:shadow-md hover:bg-opacity-100 hover:border-purple-300 transition-all duration-300 hover:scale-105 active:scale-95 backdrop-blur-sm"
          style={{ '--hover-color': '#6845f5' } as React.CSSProperties}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = '#6845f5';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = '';
          }}
        >
          로그아웃
        </button>
      </div>
    </header>
  );
}
