'use client';

import { useRouter, usePathname } from 'next/navigation';
import { useState } from 'react';
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
    <header className="absolute top-0 w-full z-50 bg-white shadow-sm px-4 py-3 flex justify-between items-center">
      {/* 로고 */}
      <Link href="/front/my-home" className="text-xl font-bold text-main-color">
        <Image
          src="/images/ch-logo.webp"
          alt="캐릭터 로고 사진"
          width={20}
          height={20}
          className="object-cover"
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
              className="w-40 py-1 text-sm"
            />
            <button
              type="submit"
              className="text-main-color hover:text-blue-600"
            >
              <Search size={20} />
            </button>
          </form>
        ) : (
          <button
            type="button"
            className="hover:text-main-color text-gray-700"
            onClick={() => router.push('/front/search')}
          >
            <Search size={20} />
          </button>
        )}

        {/* 로그아웃 */}
        <button
          onClick={handleLogout}
          className="text-sm text-white bg-point1-color px-3 py-1 rounded-md hover:bg-[#f7bf65]"
        >
          로그아웃
        </button>
      </div>
    </header>
  );
}
