'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import Button from '@/components/common/Button';
import { getCookieValue } from '@/utils/cookie';

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
  const [requestingFriends, setRequestingFriends] = useState<Set<number>>(
    new Set()
  );

  const getToken = () => getCookieValue('accessToken');

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
          console.log('[검색 결과] 백엔드 응답:', data);
          const sorted = (data.users ?? []).sort((a: User, b: User) =>
            a.nickname.localeCompare(b.nickname)
          );
          console.log('[검색 결과] 정렬된 사용자 목록:', sorted);

          // 친구 목록을 가져와서 isFriend 상태를 업데이트
          try {
            const friendsResponse = await fetch('/api/friends', {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            });

            if (friendsResponse.ok) {
              const friendsData = await friendsResponse.json();
              console.log('[친구 목록] 현재 친구들:', friendsData);

              // 검색된 사용자들의 isFriend 상태를 업데이트
              const updatedUsers = sorted.map((user: User) => ({
                ...user,
                isFriend: friendsData.some(
                  (friend: { friendUserId: number }) =>
                    friend.friendUserId === user.id
                ),
              }));

              console.log('[검색 결과] 친구 상태 업데이트 후:', updatedUsers);
              setUsers(updatedUsers);
            } else {
              setUsers(sorted);
            }
          } catch (friendsError) {
            console.error('[친구 목록 조회 실패]', friendsError);
            setUsers(sorted);
          }

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

  const handleFriendRequest = async (friendId: number) => {
    const token = getToken();

    if (!token) {
      alert('로그인이 필요합니다.');
      router.replace('/front/account/login');
      return;
    }

    // 이미 요청 중인 친구인지 확인
    if (requestingFriends.has(friendId)) {
      return;
    }

    try {
      // 요청 중 상태로 설정
      setRequestingFriends((prev) => new Set(prev).add(friendId));

      const response = await fetch('/api/friends/request', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          friendId: friendId,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        alert('친구 신청이 완료되었습니다!');
        // 성공 시 해당 유저의 isFriend 상태를 true로 업데이트
        setUsers((prevUsers) =>
          prevUsers.map((user) =>
            user.id === friendId ? { ...user, isFriend: true } : user
          )
        );
      } else {
        // "이미 친구입니다" 에러인 경우 해당 유저의 isFriend 상태를 true로 업데이트
        if (data.message === '이미 친구입니다.') {
          setUsers((prevUsers) =>
            prevUsers.map((user) =>
              user.id === friendId ? { ...user, isFriend: true } : user
            )
          );
        }
        alert(data.message || '친구 신청에 실패했습니다.');
      }
    } catch (error) {
      console.error('[친구 신청 오류]', error);
      alert('친구 신청 중 오류가 발생했습니다.');
    } finally {
      // 요청 완료 후 상태 제거
      setRequestingFriends((prev) => {
        const newSet = new Set(prev);
        newSet.delete(friendId);
        return newSet;
      });
    }
  };

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
                  칭구칭구🫶
                </Link>
              ) : (
                <>
                  <Button
                    type="button"
                    className={`small-ver text-sm ${
                      requestingFriends.has(user.id)
                        ? 'bg-gray-400 cursor-not-allowed'
                        : 'bg-blue-500 hover:bg-blue-600 text-white'
                    }`}
                    onClick={() => handleFriendRequest(user.id)}
                    disabled={requestingFriends.has(user.id)}
                  >
                    {requestingFriends.has(user.id)
                      ? '신청 중...'
                      : '친구 신청'}
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
