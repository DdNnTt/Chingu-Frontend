'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Button from '@/components/common/Button';

type Member = {
  userId: number;
  nickname: string;
  name: string;
};

export default function MemberDetail() {
  const [members, setMembers] = useState<Member[]>([]);
  const [visibleMembers, setVisibleMembers] = useState(10);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // 임시 데이터 (추후 API 연동 예정)
    const dummyData: Member[] = Array.from({ length: 20 }, (_, i) => ({
      userId: i + 1,
      nickname: `친구 닉네임${i + 1}`,
      name: `(이름)`,
    }));

    setMembers(dummyData);
    setIsLoading(false);
  }, []);

  return (
    <div className="member-list-page py-4 px-4 pt-20 mx-auto rounded-lg bg-gray-100 min-h-screen">
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
            <p className="text-center text-gray-100 text-sm">불러오는 중...</p>
          ) : (
            members.slice(0, visibleMembers).map((member) => (
              <div
                key={member.userId}
                className="bg-gray-200 px-4 py-2 rounded text-sm"
              >
                {member.nickname}
                {member.name}
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
