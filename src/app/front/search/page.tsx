'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import Button from '@/components/common/Button';

type User = {
  id: number;
  name: string;
  nickname: string;
  profilePictureUrl: string;
  isFriend: boolean;
};

export default function SearchUser() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const keyword = searchParams.get('keyword') ?? '';

  const [users, setUsers] = useState<User[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const getToken = () =>
    document.cookie
      .split('; ')
      .find((row) => row.startsWith('accessToken='))
      ?.split('=')[1];

  useEffect(() => {
    const token = getToken();

    if (!token) {
      alert('로그인이 필요합니다.');
      router.replace('/front/account/login');
      return;
    }

    const search = async () => {
      if (!keyword.trim()) {
        setUsers([]);
        setErrorMsg('친구의 이름 또는 닉네임을 입력해주세요.');
        return;
      }

      setIsSearching(true);
      setErrorMsg('');
      try {
        const res = await fetch(
          `/api/users/search?keyword=${encodeURIComponent(keyword)}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await res.json();

        if (res.ok) {
          const sorted = (data.users ?? []).sort((a: User, b: User) =>
            a.nickname.localeCompare(b.nickname)
          );
          setUsers(sorted);

          if (sorted.length === 0) {
            setErrorMsg('찾으시는 친구가 없어요');
          }
        } else {
          setErrorMsg(data.message || '검색에 실패했습니다.');
        }
      } catch (err) {
        console.error('[유저 검색 실패]', err);
        setErrorMsg('검색 중 오류가 발생했습니다.');
      } finally {
        setIsSearching(false);
      }
    };

    search();
  }, [keyword, router]);

  return (
    <div className="search-user-page py-4 px-4 pt-20 bg-gray-100 min-h-screen">
      <h2 className="text-2xl font-semibold mb-6 text-center">유저 찾기</h2>

      <div className="users-wrap scroll-overlay h-[calc(84px*7)] overflow-y-auto overflow-x-hidden flex flex-col gap-3 bg-white p-4 rounded-lg shadow-sm">
        {isSearching && (
          <p className="text-center text-sm text-gray-400">검색 중입니다...</p>
        )}

        {!isSearching && errorMsg && (
          <p className="text-center text-sm text-gray-500 m-2">{errorMsg}</p>
        )}

        <div className="user-item">
          {users.map((user) => (
            <div
              key={user.id}
              className="flex items-center justify-between bg-white p-3 rounded-md shadow-md border border-gray-100"
            >
              <div className="flex items-center gap-3">
                <Image
                  src={user.profilePictureUrl || '/images/default-profile.png'}
                  alt="프로필"
                  width={48}
                  height={48}
                  className="rounded-full border object-cover"
                />
                <div>
                  <p className="font-semibold text-gray-800">{user.nickname}</p>
                  <p className="text-sm text-gray-500">{user.name}</p>
                </div>
              </div>

              {user.isFriend ? (
                <Link
                  href={`/front/my-home?userId=${user.id}`}
                  className="px-4 py-3 rounded-lg transition-colors bg-main-color text-white small-ver bg-gray-300 text-sm"
                >
                  마이홈 놀러가기
                </Link>
              ) : (
                <>
                  <Button
                    type="button"
                    className="small-ver bg-gray-300 text-sm"
                    onClick={() => alert('친구 신청 기능은 추후 구현 예정')}
                  >
                    친구 신청
                  </Button>
                </>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
