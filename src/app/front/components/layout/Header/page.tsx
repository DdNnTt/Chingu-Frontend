'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search } from 'lucide-react'; // 아이콘 라이브러리 (lucide-react)

export default function Header() {
  const router = useRouter();
  const [nickname, setNickname] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (!token) return;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      setNickname(payload?.nickname || payload?.sub || '');
    } catch {
      setNickname('');
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('tokenType');
    alert('다음에 또 만나요 👋');
    router.replace('/front/accout/login');
  };

  return (
    <header className="w-full bg-white shadow-sm px-4 py-3 flex justify-between items-center">
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

      {/* 프로필 / 검색 / 로그아웃 */}
      <div className="flex items-center gap-3">
        {nickname && (
          <span className="text-sm text-gray-700">
            👋 {nickname}님 (로그인여부체크)
          </span>
        )}

        {/* 검색 아이콘 */}
        <button
          type="button"
          className="hover:text-main-color text-gray-700"
          onClick={() => router.push('/front/search')} // 예: 검색 페이지 경로
        >
          <Search size={20} />
        </button>

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
