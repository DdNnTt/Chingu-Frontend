'use client';

import { useEffect, useState } from 'react';
import axiosInstance from '@/libs/axios';
import Link from 'next/link';
import Button from '@/components/common/Button';

interface FriendRequest {
  fromUserId: number;
  nickname: string;
  requestedAt: string;
}

export default function FriendRequestsPage() {
  const [friendRequests, setFriendRequests] = useState<FriendRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFriendRequests = async () => {
      try {
        setLoading(true);
        const response = await axiosInstance.get('/api/friends/requests');
        setFriendRequests(response.data);
      } catch (err) {
        console.error(err);
        setError('받은 친구 요청을 불러오지 못했습니다.');
      } finally {
        setLoading(false);
      }
    };
    fetchFriendRequests();
  }, []);

  const handleRespond = async (
    friendId: number,
    status: 'accept' | 'reject'
  ) => {
    try {
      const response = await axiosInstance.put('/api/friends/respond', {
        friendId,
        status,
      });

      console.log('친구 요청 응답 성공:', response.data);

      // 성공 시 목록에서 제거
      setFriendRequests((prev) =>
        prev.filter((req) => req.fromUserId !== friendId)
      );

      alert(
        status === 'accept'
          ? '친구 요청을 수락했습니다!'
          : '친구 요청을 거절했습니다.'
      );
    } catch (err) {
      console.error('친구 요청 응답 실패:', err);
      alert('요청 처리에 실패했습니다.');
    }
  };

  if (loading) {
    return (
      <div className="p-6 text-center text-gray-500">
        받은 친구 요청을 불러오는 중...
      </div>
    );
  }

  if (error) {
    return <div className="p-6 text-center text-red-600">{error}</div>;
  }

  return (
    <div className="max-w-lg mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">받은 친구 요청</h2>
        <Link
          href="/front/my-home"
          className="text-blue-600 hover:underline text-sm"
        >
          ← 뒤로
        </Link>
      </div>

      {friendRequests.length === 0 ? (
        <div className="text-gray-400 text-center">
          받은 친구 요청이 없습니다.
        </div>
      ) : (
        <ul className="space-y-3">
          {friendRequests.map((request) => (
            <li
              key={request.fromUserId}
              className="flex items-center justify-between bg-white border rounded-lg shadow-sm px-4 py-3"
            >
              <div>
                <span className="font-semibold text-lg">
                  {request.nickname}
                </span>
                <div className="text-xs text-gray-400 mt-1">
                  요청일: {new Date(request.requestedAt).toLocaleDateString()}
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  type="button"
                  onClick={() => handleRespond(request.fromUserId, 'accept')}
                  className="bg-green-600 text-white text-sm px-3 py-1"
                >
                  수락
                </Button>
                <Button
                  type="button"
                  onClick={() => handleRespond(request.fromUserId, 'reject')}
                  className="bg-red-600 text-white text-sm px-3 py-1"
                >
                  거절
                </Button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
