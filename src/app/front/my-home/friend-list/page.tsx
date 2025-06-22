'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from '@/libs/axios';

type Friend = {
  friendUserId: number;
  nickname: string;
  name: string;
  score: number;
  friendSince: string;
};

export default function FriendList() {
  const [friends, setFriends] = useState<Friend[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const router = useRouter();

  // 친구 목록 조회
  const fetchFriends = async () => {
    try {
      setIsLoading(true);
      setError('');
      const response = await axios.get('/api/friends');
      setFriends(response.data);
    } catch (err) {
      setError('친구 목록을 불러오는데 실패했습니다.');
      console.error('친구 목록 조회 실패:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchFriends();
  }, []);

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
        {isLoading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
            <p className="mt-2 text-gray-600">친구 목록을 불러오는 중...</p>
          </div>
        ) : error ? (
          <div className="text-center py-8">
            <p className="text-red-500">{error}</p>
            <button
              onClick={fetchFriends}
              className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              다시 시도
            </button>
          </div>
        ) : friends.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">아직 친구가 없습니다.</p>
          </div>
        ) : (
          friends.map((friend) => (
            <div
              key={friend.friendUserId}
              className="friend-item flex items-center justify-between bg-gray-50 p-3 rounded-md"
            >
              <div className="flex items-center gap-3">
                <span className="font-medium text-gray-800">
                  {friend.nickname}
                </span>
              </div>
              <div className="text-sm text-gray-500">
                우정도 {friend.score}%
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
