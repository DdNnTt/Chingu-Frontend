'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

type Friend = {
  friendUserId: number;
  nickname: string;
  name: string;
  score: number;
  friendSince: string;
};

const FRIENDS_DATA: Friend[] = [
  {
    friendUserId: 1,
    nickname: '친구닉네임1',
    name: '친구이름1',
    score: 85,
    friendSince: '2025-01-22T10:30:00',
  },
  {
    friendUserId: 2,
    nickname: '친구닉네임2',
    name: '친구이름2',
    score: 90,
    friendSince: '2025-01-21T15:00:00',
  },
  {
    friendUserId: 3,
    nickname: '친구닉네임3',
    name: '친구이름3',
    score: 70,
    friendSince: '2025-01-20T09:15:00',
  },
  {
    friendUserId: 4,
    nickname: '친구닉네임4',
    name: '친구이름4',
    score: 75,
    friendSince: '2025-01-19T14:20:00',
  },
  {
    friendUserId: 5,
    nickname: '친구닉네임5',
    name: '친구이름5',
    score: 95,
    friendSince: '2025-01-18T11:45:00',
  },
  {
    friendUserId: 6,
    nickname: '친구닉네임6',
    name: '친구이름6',
    score: 80,
    friendSince: '2025-01-17T16:30:00',
  },
  {
    friendUserId: 7,
    nickname: '친구닉네임7',
    name: '친구이름7',
    score: 65,
    friendSince: '2025-01-16T13:10:00',
  },
  {
    friendUserId: 8,
    nickname: '친구닉네임8',
    name: '친구이름8',
    score: 65,
    friendSince: '2025-01-16T13:10:00',
  },
  {
    friendUserId: 9,
    nickname: '친구닉네임9',
    name: '친구이름9',
    score: 65,
    friendSince: '2025-01-16T13:10:00',
  },
  {
    friendUserId: 10,
    nickname: '친구닉네임10',
    name: '친구이름10',
    score: 65,
    friendSince: '2025-01-16T13:10:00',
  },
];

export default function FriendList() {
  const [friends] = useState<Friend[]>(FRIENDS_DATA);
  const router = useRouter();

  return (
    <div className="friend-list-page py-4 px-4 pt-20 mx-auto rounded-lg bg-gray-100">
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
          내 친구 목록
        </h2>
      </div>

      <div className="friend-list bg-white rounded-lg shadow-sm p-4 max-h-[calc(100vh-300px)] overflow-y-auto space-y-3">
        {friends.map((friend) => (
          <div
            key={friend.friendUserId}
            className="friend-item flex items-center justify-between bg-gray-50 p-3 rounded-md"
          >
            <div className="flex items-center gap-3">
              <span className="font-medium text-gray-800">
                {friend.nickname}
              </span>
            </div>
            <div className="text-sm text-gray-500">우정도 {friend.score}%</div>
          </div>
        ))}
      </div>
    </div>
  );
}
