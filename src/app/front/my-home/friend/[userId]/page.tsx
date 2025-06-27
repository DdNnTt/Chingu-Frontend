'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Button from '@/components/common/Button';
import { useRouter, useParams } from 'next/navigation';
import axios from '@/libs/axios';

interface UserInfo {
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

export default function FriendHomePage() {
  const router = useRouter();
  const params = useParams();
  const userId = params.userId as string;

  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`/api/users/${userId}`);
        setUserInfo(response.data);
      } catch (err) {
        console.error('Failed to fetch user info:', err);
        setError('유저 정보를 불러오는데 실패했습니다.');
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchUserInfo();
    }
  }, [userId]);

  const handleSendMessage = () => {
    router.push('/front/message/write');
  };

  const handleBackToFriendList = () => {
    router.push('/front/my-home/friend-list');
  };

  if (loading) {
    return (
      <div className="my-home-page py-4 px-4 pt-20 mx-auto rounded-lg bg-gray-100">
        <div className="text-center">로딩 중...</div>
      </div>
    );
  }

  if (error || !userInfo) {
    return (
      <div className="my-home-page py-4 px-4 pt-20 mx-auto rounded-lg bg-gray-100">
        <div className="text-center text-red-500 mb-4">
          {error || '유저 정보를 찾을 수 없습니다.'}
        </div>
        <Button
          type="button"
          className="w-full"
          onClick={handleBackToFriendList}
        >
          친구 목록으로 돌아가기
        </Button>
      </div>
    );
  }

  return (
    <div className="my-home-page py-4 px-4 pt-20 mx-auto rounded-lg bg-gray-100">
      <h2 className="text-2xl font-semibold mb-6 text-center">
        {userInfo.nickname}님의 마이 홈
      </h2>

      <div className="profile-card flex items-center justify-between mb-4 p-4 bg-white rounded-lg shadow-sm gap-2">
        <div className="flex items-center gap-2">
          <Image
            src={userInfo.profilePictureUrl || '/images/default-profile.jpg'}
            alt="프로필 사진"
            width={64}
            height={64}
            className="object-cover rounded-full border border-gray-300"
          />
          <div className="profile-info">
            <h3 className="text-lg font-semibold">{userInfo.nickname}</h3>
            <p className="text-sm text-gray-500">
              친구 수 <span>20</span>
            </p>
          </div>
        </div>
        <p className="text-sm font-semibold text-gray-700">
          우정온도 <span className="main-color">90%</span>
        </p>
      </div>

      <div className="profile-intro p-4 bg-white rounded-lg shadow-sm mb-4">
        <p className="text-gray-700">
          {userInfo.bio || '자기소개가 없습니다.'}
        </p>
      </div>

      <div className="user-details p-4 bg-white rounded-lg shadow-sm mb-4">
        <h3 className="text-lg font-semibold mb-2">유저 정보</h3>
        <div className="space-y-2 text-sm">
          <p>
            <span className="font-medium">이름:</span> {userInfo.name}
          </p>
          <p>
            <span className="font-medium">아이디:</span> {userInfo.userId}
          </p>
          <p>
            <span className="font-medium">가입일:</span>{' '}
            {new Date(userInfo.joinDate).toLocaleDateString()}
          </p>
          <p>
            <span className="font-medium">마지막 로그인:</span>{' '}
            {new Date(userInfo.lastLoginDate).toLocaleDateString()}
          </p>
        </div>
      </div>

      <div className="flex gap-2 mb-4">
        <Button type="button" className="flex-1 text-white">
          친구 끊기
        </Button>
        <Button
          type="button"
          className="flex-1 text-white"
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
