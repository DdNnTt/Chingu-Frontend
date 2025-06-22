'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Input from '@/components/common/Input';
import Button from '@/components/common/Button';

type Friend = {
  userId: number;
  nickname: string;
};

export default function GroupAdd() {
  const router = useRouter();
  const [groupName, setGroupName] = useState('');
  const [description, setDescription] = useState('');
  const [friends, setFriends] = useState<Friend[]>([]);
  const [selectedFriendIds, setSelectedFriendIds] = useState<number[]>([]);

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

    // 친구 목록 불러오기
    fetch('/api/friends', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data: Friend[]) => setFriends(data))
      .catch((err) => {
        console.error('[친구 목록 조회 오류]', err);
        alert('친구 목록을 불러오지 못했습니다.');
      });
  }, [router]);

  const handleCheck = (userId: number) => {
    setSelectedFriendIds((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const token = document.cookie
      .split('; ')
      .find((row) => row.startsWith('accessToken='))
      ?.split('=')[1];

    if (!token) return;

    try {
      const res = await fetch('/api/groups/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          groupName,
          description,
        }),
      });

      if (!res.ok) throw new Error('그룹 생성 실패');

      const createdGroup = await res.json();
      console.log('[생성된 그룹 정보]', createdGroup);
      alert(`'${createdGroup.groupName}' 그룹이 생성되었습니다!`);
      router.push('/front/my-home/group-list');
    } catch (err) {
      console.error('[그룹 생성 실패]', err);
      alert('그룹 생성 중 문제가 발생했습니다.');
    }
  };

  return (
    <div className="group-add-page py-4 px-4 pt-20 mx-auto rounded-lg bg-gray-100">
      <h2 className="text-2xl font-semibold mb-6 text-center">내 그룹 목록</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* 그룹명 입력 */}
        <div className="mb-4 p-4 bg-white rounded-lg shadow-sm gap-2">
          <label className="block mb-1 font-medium">그룹명</label>
          <Input
            type="text"
            placeholder="그룹명 입력"
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
          />
        </div>

        {/* 그룹 설명 입력 */}
        <div className="mb-4 p-4 bg-white rounded-lg shadow-sm gap-2">
          <label className="block mb-1 font-medium">그룹 설명</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="그룹 설명 입력"
            className="mt-1 block w-full px-3 py-2 border bg-[#f3f3f5] rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-indigo-300"
          />
        </div>

        {/* 친구 선택 */}
        <div className="mb-4 p-4 bg-white rounded-lg shadow-sm gap-2">
          <p className="mb-1 font-medium">그룹으로 초대할 친구 선택</p>
          <div className="border p-3 rounded max-h-40 overflow-y-auto space-y-1">
            {friends.length === 0 ? (
              <p className="text-gray-400 text-sm">
                초대 가능한 친구가 없습니다.
              </p>
            ) : (
              friends.map((friend) => (
                <label
                  key={friend.userId}
                  className="flex items-center space-x-2"
                >
                  <input
                    type="checkbox"
                    checked={selectedFriendIds.includes(friend.userId)}
                    onChange={() => handleCheck(friend.userId)}
                  />
                  <span>{friend.nickname}</span>
                </label>
              ))
            )}
          </div>
        </div>

        {/* 그룹 추가 버튼 */}
        <Button type="submit" className="w-full">
          그룹 추가
        </Button>
      </form>
    </div>
  );
}
