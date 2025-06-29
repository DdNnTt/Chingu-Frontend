'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Button from '@/components/common/Button';
import { useRouter, useParams } from 'next/navigation';

interface User {
  id: number;
  userId: string;
  name: string;
  nickname: string;
  email: string;
  profilePictureUrl: string;
  bio: string;
  joinDate: string;
  lastLoginDate: string;
  socialType: string;
}

export default function FriendDetailPage() {
  const router = useRouter();
  const params = useParams();
  const friendId = params.friendId as string;

  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/users/${friendId}`);

        if (!response.ok) {
          if (response.status === 404) {
            setError('해당 사용자를 찾을 수 없습니다.');
          } else {
            throw new Error('사용자 정보를 불러오는데 실패했습니다.');
          }
          return;
        }

        const userData: User = await response.json();
        setUser(userData);
      } catch (err) {
        setError(err instanceof Error ? err.message : '오류가 발생했습니다.');
      } finally {
        setLoading(false);
      }
    };

    if (friendId) {
      fetchUserInfo();
    }
  }, [friendId]);

  const handleSendMessage = () => {
    router.push('/front/message/write');
  };

  const handleGoBack = () => {
    router.back();
  };

  if (loading) {
    return (
      <div className="my-home-page py-4 px-4 pt-20 mx-auto rounded-lg bg-gray-100">
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">사용자 정보를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="my-home-page py-4 px-4 pt-20 mx-auto rounded-lg bg-gray-100">
        <div className="text-center py-8">
          <p className="text-red-600 mb-4">{error}</p>
          <Button
            type="button"
            onClick={handleGoBack}
            className="bg-blue-600 text-white"
          >
            뒤로 가기
          </Button>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="my-home-page py-4 px-4 pt-20 mx-auto rounded-lg bg-gray-100">
        <div className="text-center py-8">
          <p className="text-gray-600 mb-4">사용자 정보를 찾을 수 없습니다.</p>
          <Button
            type="button"
            onClick={handleGoBack}
            className="bg-blue-600 text-white"
          >
            뒤로 가기
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="my-home-page py-4 px-4 pt-20 mx-auto rounded-lg bg-gray-100">
      <div className="relative mb-6 min-h-[40px] flex items-center justify-center">
        <Button
          type="button"
          onClick={handleGoBack}
          variant="secondary"
          className="absolute left-0 top-1/2 -translate-y-1/2 px-3 py-1 text-sm"
        >
          ← 뒤로
        </Button>
        <h2 className="text-2xl font-semibold text-center w-full">
          사용자 마이 홈
        </h2>
      </div>

      <div className="profile-card flex items-center justify-between mb-4 p-4 bg-white rounded-lg shadow-sm gap-2">
        <div className="flex items-center gap-2">
          <Image
            src={user.profilePictureUrl || '/images/test-profile.png'}
            alt="프로필 사진"
            width={64}
            height={64}
            className="object-cover rounded-full border border-gray-300"
          />
          <div className="profile-info">
            <h3 className="text-lg font-semibold">{user.nickname}</h3>
            <p className="text-sm text-gray-500">이름: {user.name}</p>
            <p className="text-sm text-gray-500">ID: {user.userId}</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-xs text-gray-500">
            가입일: {new Date(user.joinDate).toLocaleDateString()}
          </p>
          <p className="text-xs text-gray-500">
            마지막 로그인: {new Date(user.lastLoginDate).toLocaleDateString()}
          </p>
        </div>
      </div>

      <div className="profile-intro p-4 bg-white rounded-lg shadow-sm mb-4">
        <h4 className="font-semibold mb-2">자기소개</h4>
        <p className="text-gray-700">{user.bio || '자기소개가 없습니다.'}</p>
      </div>

      <div className="flex gap-2 mb-4">
        <Button type="button" className="flex-1 text-white bg-red-600">
          친구 끊기
        </Button>
        <Button
          type="button"
          className="flex-1 text-white bg-blue-600"
          onClick={handleSendMessage}
        >
          쪽지 보내기
        </Button>
      </div>

      <div className="schedule-calendar bg-white p-6 rounded-lg shadow-sm mb-4 text-center text-gray-500">
        일정 캘린더가 들어갈 부분
      </div>

      <div className="my-groups bg-white p-4 rounded-lg shadow-sm">
        <h3 className="text-lg font-semibold mb-2">내 그룹 목록</h3>
        <div className="group-item bg-gray-200 p-3 rounded mb-2">그룹1</div>
        <div className="group-item bg-gray-200 p-3 rounded mb-2">그룹2</div>
        <div className="group-item bg-gray-200 p-3 rounded">그룹3</div>

        <Button
          type="button"
          className="flex-1 w-full bg-blue-600 text-white mt-4"
        >
          더보기
        </Button>
      </div>
    </div>
  );
}
