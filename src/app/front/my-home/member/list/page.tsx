'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Button from '@/components/common/Button';
import { getCookieValue } from '@/utils/cookie';

type Member = {
  userId: number;
  nickname: string;
  name: string;
  email: string;
};

export default function MemberDetail() {
  const [members, setMembers] = useState<Member[]>([]);
  const [visibleMembers, setVisibleMembers] = useState(10);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const router = useRouter();

  useEffect(() => {
    // URL에서 groupId 가져오기
    const params = new URLSearchParams(window.location.search);
    const id = params.get('groupId');

    if (!id) {
      setError('groupId가 없습니다.');
      setIsLoading(false);
      return;
    }

    const token = getCookieValue('accessToken');

    if (!token) {
      alert('로그인이 필요합니다.');
      router.push('/front/account/login');
      return;
    }

    // 그룹 멤버 목록 조회
    fetch(`/api/groups/${id}/members`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(async (res) => {
        if (!res.ok) {
          const errorData = await res
            .json()
            .catch(() => ({ message: '멤버 목록 조회 실패' }));
          throw new Error(errorData.message || '멤버 목록 조회 실패');
        }
        const data = await res.json();
        console.log('[멤버 목록] API 응답:', data);
        setMembers(data);
      })
      .catch((err) => {
        console.error('[멤버 목록 조회 오류]', err);
        setError(err.message || '멤버 목록을 불러오지 못했습니다.');
      })
      .finally(() => setIsLoading(false));
  }, [router]);

  return (
    <div className="member-list-page py-24 px-4 mx-auto rounded-lg bg-gray-100 min-h-screen">
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
        <h2 className="text-2xl font-semibold text-center flex-1">멤버 목록</h2>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="space-y-2 max-h-[530px] overflow-y-auto scroll-overlay">
          {isLoading ? (
            <p className="text-center text-gray-500 text-sm">불러오는 중...</p>
          ) : error ? (
            <div className="text-center text-red-500 text-sm">{error}</div>
          ) : members.length === 0 ? (
            <p className="text-center text-gray-500 text-sm">
              멤버가 없습니다.
            </p>
          ) : (
            members.slice(0, visibleMembers).map((member) => (
              <div
                key={member.userId}
                className="bg-gray-100 px-4 py-3 rounded-lg shadow-sm border border-gray-200"
              >
                <div className="font-medium text-gray-800">
                  {member.nickname}
                  <span className="text-sm text-gray-600 font-normal">
                    ({member.name})
                  </span>
                </div>
              </div>
            ))
          )}
        </div>

        {visibleMembers < members.length && (
          <div className="text-center mt-4">
            <Button
              type="button"
              onClick={() => setVisibleMembers((prev) => prev + 5)}
              className="text-sm text-blue-600 w-full"
            >
              더보기
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
