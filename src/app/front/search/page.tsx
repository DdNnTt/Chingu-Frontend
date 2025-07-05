'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Button from '@/components/common/Button';
import Image from 'next/image';
import Link from 'next/link';

type Group = {
  groupId: number;
  groupName: string;
  description: string;
  createdAt: string;
};

export default function SearchUser() {
  const [groups, setGroups] = useState<Group[]>([]);
  const [visibleGroups, setVisibleGroups] = useState(3);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const token = document.cookie
      .split('; ')
      .find((row) => row.startsWith('accessToken='))
      ?.split('=')[1];

    if (!token) {
      alert('로그인이 필요합니다.');
      router.push('/front/account/login');
      return;
    }

    const fetchGroups = async () => {
      try {
        const res = await fetch(`/api/groups/mygroups`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) throw new Error('그룹 목록 조회 실패');
        const data = await res.json();
        setGroups(data);
      } catch (err) {
        console.error('[그룹 목록 조회 오류]', err);
        setError('그룹 목록을 불러오지 못했습니다.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchGroups();
  }, [router]);

  return (
    <div className="search-user-page py-4 px-4 pt-20 mx-auto rounded-lg bg-gray-100">
      <h2 className="text-2xl font-semibold mb-6 text-center">유저 찾기</h2>

      <div
        className="group-list bg-white rounded-lg shadow-sm p-4 pr-1 space-y-3 max-h-[calc(90px*3)] overflow-y-auto scroll-overlay"
        style={{ scrollbarGutter: 'stable' }}
      >
        {isLoading ? (
          <div className="text-center text-gray-400 text-sm">
            불러오는 중...
          </div>
        ) : error ? (
          <div className="text-red-500">{error}</div>
        ) : groups.length === 0 ? (
          <div className="text-center text-gray-400 text-sm">
            그룹 목록이 없습니다. 그룹을 생성해주세요!
          </div>
        ) : (
          groups.slice(0, visibleGroups).map((group) => (
            <div
              key={group.groupId}
              className="group-item flex items-center justify-between bg-white py-2 px-3 rounded-md shadow-sm cursor-pointer hover:bg-gray-50"
              onClick={() =>
                router.push(
                  `/front/my-home/group/detail?groupId=${group.groupId}`
                )
              }
            >
              <div>
                <div className="font-semibold text-gray-800">
                  {group.groupName}
                </div>
                <div className="text-sm text-gray-500">{group.description}</div>
              </div>
            </div>
          ))
        )}

        {visibleGroups < groups.length && (
          <div className="text-center mt-2">
            <Button
              type="button"
              onClick={() => setVisibleGroups((prev) => prev + 3)}
              className="flex-1 w-full bg-blue-600 text-white mt-4"
            >
              더보기
            </Button>
          </div>
        )}
      </div>

      <div className="profile-card flex items-center justify-between mb-4 p-4 bg-white rounded-lg shadow-sm">
        <div className="flex items-center gap-2">
          <Image
            src="/images/test-profile.png"
            alt="프로필 사진"
            width={64}
            height={64}
            className="object-cover rounded-full border border-gray-300"
          />
          <div className="profile-info">
            <h3 className="text-lg font-semibold">닉네임</h3>
            <div className="text-sm text-gray-500">친구 이름</div>
          </div>
        </div>
        {/* 친구 마이홈 이동동 */}
        <Link
          href="/front/my-home"
          className="text-sm text-white bg-point1-color px-3 py-1 rounded-md hover:bg-[#f7bf65]"
        >
          마이홈 놀러가기
        </Link>
      </div>
    </div>
  );
}
