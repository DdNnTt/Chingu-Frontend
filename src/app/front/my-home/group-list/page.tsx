'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

type Group = {
  groupId: number;
  groupName: string;
  description: string;
  createdAt: string;
};

export default function GroupList() {
  const [groups, setGroups] = useState<Group[]>([]);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const getCookieValue = (name: string) => {
      const match = document.cookie.match(new RegExp(`(^| )${name}=([^;]+)`));
      return match ? decodeURIComponent(match[2]) : null;
    };

    const token = getCookieValue('accessToken');
    if (!token) {
      alert('로그인이 필요합니다.');
      router.push('/front/account/login');
      return;
    }

    fetch(`/api/groups/mygroups`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(async (res) => {
        if (!res.ok) throw new Error('그룹 목록 조회 실패');
        const data = await res.json();
        setGroups(data);
      })
      .catch((err) => {
        console.error('[그룹 목록 조회 오류]', err);
        setError('그룹 목록을 불러오지 못했습니다.');
      })
      .finally(() => setIsLoading(false));
  }, [router]);

  return (
    <div className="group-list-page py-4 px-4 pt-20 mx-auto rounded-lg bg-gray-100">
      <div className="flex items-center mb-6">
        <button
          onClick={() => router.back()}
          className="text-gray-600 hover:text-gray-800"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"
            />
          </svg>
        </button>
        <h2 className="text-2xl font-semibold text-center flex-1">
          내 그룹 목록
        </h2>
      </div>

      <div className="flex justify-end mb-4">
        <Link
          href="/front/my-home/group/add"
          className="text-sm px-3 py-1 bg-main-color text-white rounded hover:bg-blue-700"
        >
          그룹 생성
        </Link>
      </div>

      <div className="group-list bg-white rounded-lg shadow-sm p-4 max-h-[calc(100vh-300px)] overflow-y-auto space-y-3">
        {isLoading ? (
          <div className="text-center text-gray-400">불러오는 중...</div>
        ) : error ? (
          <div className="text-red-500">{error}</div>
        ) : groups.length === 0 ? (
          <div className="text-center text-gray-500">
            그룹 목록이 없습니다. 그룹을 생성해주세요!
          </div>
        ) : (
          groups.map((group) => (
            <div
              key={group.groupId}
              className="flex items-center justify-between bg-white p-3 rounded-md shadow-sm"
            >
              <div>
                <div className="font-semibold text-gray-800">
                  {group.groupName}
                </div>
                <div className="text-sm text-gray-500">{group.description}</div>
              </div>
              <button className="text-sm px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600">
                그룹 탈퇴
              </button>
            </div>
          ))
        )}
      </div>

      {/* 더보기 버튼 (예시용) */}
      <div className="text-center mt-4">
        <button className="text-sm text-blue-600 hover:underline">
          더보기
        </button>
      </div>

      {/* 요청 승인 대기 목록 */}
      <div className="mt-10">
        <h3 className="text-sm font-semibold text-gray-700 mb-2">
          요청 승인 대기
        </h3>

        {/* 예시 데이터, 향후 대기 목록 API로 대체 */}
        <div className="flex items-center justify-between bg-white p-3 rounded-md shadow-sm">
          <div className="font-medium text-gray-800">그룹4</div>
          <div className="space-x-2">
            <button className="text-xs px-2 py-1 bg-gray-300 rounded hover:bg-gray-400">
              거절
            </button>
            <button className="text-xs px-2 py-1 bg-green-500 text-white rounded hover:bg-green-600">
              승인
            </button>
          </div>
        </div>

        <div className="text-center mt-4">
          <button className="text-sm text-blue-600 hover:underline">
            더보기
          </button>
        </div>
      </div>
    </div>
  );
}
