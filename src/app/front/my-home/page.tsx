'use client';

import Link from 'next/link';
import Image from 'next/image';
import Button from '@/components/common/Button';
import ScheduleModal from '@/components/my-home/ScheduleModal';
import ScheduleEditModal from '@/components/my-home/ScheduleEditModal';
import { useState, useEffect } from 'react';
import axios from '@/libs/axios';
import { useRouter } from 'next/navigation';
import { getCookieValue } from '@/utils/cookie';

interface Schedule {
  id: number;
  user: {
    id: number;
    userId: string;
    name: string;
    nickname: string;
    email: string;
    password: string;
    profilePictureUrl: string;
    bio: string;
    joinDate: string;
    lastLoginDate: string;
    uniqueKey: string;
    socialType: string;
  };
  title: string;
  description: string;
  scheduleDate: string;
}

interface JwtPayload {
  nickname?: string;
  sub?: string;
  [key: string]: unknown; // 다른 필드가 있어도 에러 방지
}

interface Friend {
  friendUserId: number;
  nickname: string;
  name: string;
  score: number;
  friendSince: string;
}

export default function MyHome() {
  const [nickname, setNickname] = useState('');
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [friends, setFriends] = useState<Friend[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedSchedule, setSelectedSchedule] = useState<Schedule | null>(
    null
  );
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [showAllSchedules, setShowAllSchedules] = useState(false);
  const router = useRouter();

  // 일정 목록 조회
  const fetchSchedules = async () => {
    try {
      const response = await axios.get('/api/schedules');
      setSchedules(response.data);
    } catch (err) {
      console.error('일정 조회 실패:', err);
    }
  };

  // 친구 목록 조회
  const fetchFriends = async () => {
    try {
      const response = await axios.get('/api/friends');
      setFriends(response.data);
    } catch (err) {
      console.error('친구 목록 조회 실패:', err);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError('');
      try {
        await Promise.all([fetchSchedules(), fetchFriends()]);
      } catch {
        setError('데이터를 불러오는데 실패했습니다.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleOpenScheduleModal = () => {
    setIsScheduleModalOpen(true);
  };

  const handleCloseScheduleModal = () => {
    setIsScheduleModalOpen(false);
    // 모달이 닫힐 때 일정 목록 새로고침
    fetchSchedules();
  };

  const handleOpenEditModal = (schedule: Schedule) => {
    setSelectedSchedule(schedule);
    setIsEditModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setSelectedSchedule(null);
    // 모달이 닫힐 때 일정 목록 새로고침
    fetchSchedules();
  };

  // 로그인 후 닉네임 노출
  function decodeJwtPayload(token: string): JwtPayload | null {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');

      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map((c) => `%${c.charCodeAt(0).toString(16).padStart(2, '0')}`)
          .join('')
      );

      return JSON.parse(jsonPayload);
    } catch (e) {
      console.error('[토큰 파싱 오류]', e);
      return null;
    }
  }

  useEffect(() => {
    // accessToken payload에서 nickname 추출
    const token = getCookieValue('accessToken');
    if (!token) return;

    const payload = decodeJwtPayload(token);
    if (payload?.nickname) {
      setNickname(payload.nickname);
    } else if (payload?.sub) {
      setNickname(payload.sub);
    }
  }, []);

  // 최신 3개의 일정만 표시
  const recentSchedules = schedules
    .sort(
      (a, b) =>
        new Date(b.scheduleDate).getTime() - new Date(a.scheduleDate).getTime()
    )
    .slice(0, 3);

  // 전체 일정 (최신순 정렬)
  const allSchedules = schedules.sort(
    (a, b) =>
      new Date(b.scheduleDate).getTime() - new Date(a.scheduleDate).getTime()
  );

  // 현재 표시할 일정 목록
  const displaySchedules = showAllSchedules ? allSchedules : recentSchedules;

  return (
    <div className="my-home-page py-4 px-4 pt-20 mx-auto rounded-lg bg-gray-100 overflow-y-auto">
      <h2 className="text-2xl font-semibold mb-6 text-center">마이 홈</h2>

      <div className="profile-card flex items-center mb-4 p-4 bg-white rounded-lg shadow-sm gap-2">
        <Image
          src="/images/test-profile.png"
          alt="프로필 사진"
          width={64}
          height={64}
          className="object-cover rounded-full border border-gray-300"
        />
        <div className="profile-info">
          {/* <h3 className="text-lg font-semibold">닉네임</h3> */}
          <h3 className="text-lg font-semibold">{nickname || '닉네임'}</h3>
          <Link
            href="/front/my-home/friend-list"
            className="text-sm text-gray-500 hover:text-gray-700"
          >
            친구 수 <span>{friends.length}</span>
          </Link>
        </div>
      </div>

      <div className="profile-intro p-4 bg-white rounded-lg shadow-sm mb-4">
        <p className="text-gray-700">자기소개 멘트</p>
      </div>

      <div className="flex gap-2 mb-4">
        <Link
          href="/front/message/list"
          className="message-box flex-1 bg-main-color text-white px-4 py-3 rounded-md text-center flex items-center justify-center"
        >
          <span>나의 쪽지함</span>
          <span className="ml-2 bg-red-500 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full">
            5
          </span>
        </Link>

        <Button
          type="button"
          className="flex-1 text-white"
          onClick={handleOpenScheduleModal}
        >
          일정 등록
        </Button>
      </div>

      <div className="schedule-calendar bg-white p-6 rounded-lg shadow-sm mb-4">
        <h2 className="text-lg font-semibold mb-4">나의 일정</h2>
        {isLoading ? (
          <div className="text-center text-gray-500">일정을 불러오는 중...</div>
        ) : error ? (
          <div className="text-center text-red-500">{error}</div>
        ) : displaySchedules.length === 0 ? (
          <div className="text-center text-gray-500">
            등록된 일정이 없습니다.
          </div>
        ) : (
          <div className="space-y-2">
            {displaySchedules.map((schedule) => (
              <div
                key={schedule.id}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors"
                onClick={() => handleOpenEditModal(schedule)}
              >
                <span className="font-medium">{schedule.title}</span>
                <span className="text-gray-600">{schedule.scheduleDate}</span>
              </div>
            ))}
          </div>
        )}

        {/* 전체 일정 보기/접기 버튼 */}
        {schedules.length > 3 && (
          <div className="mt-4 text-center">
            <button
              type="button"
              onClick={() => setShowAllSchedules(!showAllSchedules)}
              className="text-blue-600 hover:text-blue-800 text-sm font-medium transition-colors"
            >
              {showAllSchedules ? '최신 3개만 보기' : '전체 일정 보기'}
            </button>
          </div>
        )}
      </div>

      <div className="my-groups bg-white p-4 rounded-lg shadow-sm">
        <h3 className="text-lg font-semibold mb-2">내 그룹 목록</h3>
        <div className="group-item bg-gray-200 p-3 rounded mb-2">그룹1</div>
        <div className="group-item bg-gray-200 p-3 rounded mb-2">그룹2</div>
        <div className="group-item bg-gray-200 p-3 rounded">그룹3</div>

        <Button
          type="button"
          className="flex-1 w-full bg-blue-600 text-white mt-4"
          onClick={() => router.push('/front/my-home/group-list')}
        >
          더보기
        </Button>
      </div>

      <ScheduleModal
        isOpen={isScheduleModalOpen}
        onClose={handleCloseScheduleModal}
      />

      <ScheduleEditModal
        isOpen={isEditModalOpen}
        onClose={handleCloseEditModal}
        schedule={selectedSchedule}
      />
    </div>
  );
}
