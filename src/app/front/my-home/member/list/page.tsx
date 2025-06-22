'use client';

import { useEffect, useState } from 'react';

type Member = {
  userId: number;
  nickname: string;
  name: string;
};

export default function MemberDetail() {
  const [members, setMembers] = useState<Member[]>([]);
  const [visibleMembers, setVisibleMembers] = useState(10);
  const [isLoading, setIsLoading] = useState(true);

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
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold text-center mb-4">멤버 목록</h2>

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
            <button
              onClick={() => setVisibleMembers((prev) => prev + 5)}
              className="text-sm text-blue-600 hover:underline"
            >
              더보기
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
