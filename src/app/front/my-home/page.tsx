'use client';

import Link from 'next/link';
import Image from 'next/image';
import Button from '@/components/common/Button';
import ScheduleModal from '@/components/my-home/ScheduleModal';
import ScheduleEditModal from '@/components/my-home/ScheduleEditModal';
import { useState, useEffect } from 'react';
import axiosInstance from '@/libs/axios';
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
  [key: string]: unknown;
}

interface Friend {
  friendUserId: number;
  nickname: string;
  name: string;
  score: number;
  friendSince: string;
}

interface FriendRequest {
  fromUserId: number;
  nickname: string;
  requestedAt: string;
}

interface Group {
  groupId: number;
  groupName: string;
  description: string;
  createdAt: string;
}

// 퀴즈 관련 타입 정의
interface Quiz {
  id: number;
  title: string;
  description: string;
  totalQuestions: number;
  creatorNickname: string;
}

interface QuizStats {
  totalQuizzes: number;
  totalFriendshipScore: number;
}

interface MyQuizDetailResponse {
  quizSetId: number;
  title?: string;
  description?: string;
  questions: Array<{ questionId: number }>;
  creatorNickname: string;
}

interface Question {
  id: number;
  content: string;
  option1: string;
  option2: string;
  option3: string;
  option4: string;
}

export default function MyHome() {
  const [nickname, setNickname] = useState<string>('');
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [friends, setFriends] = useState<Friend[]>([]);
  const [groups, setGroups] = useState<Group[]>([]);
  const [friendRequests, setFriendRequests] = useState<FriendRequest[]>([]);
  const [receivedMessagesCount, setReceivedMessagesCount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedSchedule, setSelectedSchedule] = useState<Schedule | null>(
    null
  );
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [showAllSchedules, setShowAllSchedules] = useState(false);

  // 퀴즈 관련 상태 추가
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [quizStats, setQuizStats] = useState<QuizStats>({
    totalQuizzes: 0,
    totalFriendshipScore: 0,
  });
  const [isQuizLoading, setIsQuizLoading] = useState(false);

  // 랜덤 문제 및 전체 문제 상태
  const [randomQuestions, setRandomQuestions] = useState<Question[]>([]);
  const [allQuestions, setAllQuestions] = useState<Question[]>([]);
  const [isRandomLoading, setIsRandomLoading] = useState(false);
  const [isAllLoading, setIsAllLoading] = useState(false);

  // 더보기 상태
  const [showMoreRandom, setShowMoreRandom] = useState(false);
  const [showMoreAll, setShowMoreAll] = useState(false);

  const router = useRouter();

  // 일정 목록 조회
  const fetchSchedules = async () => {
    try {
      const response = await axiosInstance.get('/api/schedules');
      setSchedules(response.data);
    } catch (err) {
      console.error('일정 조회 실패:', err);
    }
  };

  // 친구 목록 조회
  const fetchFriends = async () => {
    try {
      const response = await axiosInstance.get('/api/friends');
      setFriends(response.data);
    } catch (err) {
      console.error('친구 목록 조회 실패:', err);
    }
  };

  const fetchFriendRequests = async () => {
    try {
      const response = await axiosInstance.get('/api/friends/requests');
      setFriendRequests(response.data);
    } catch (err) {
      console.error('받은 친구 요청 조회 실패:', err);
    }
  };

  // 내가 만든 퀴즈 목록 조회
  const fetchMyQuizzes = async () => {
    try {
      setIsQuizLoading(true);

      // 내가 만든 퀴즈 세트 조회
      const { data } = await axiosInstance.get<MyQuizDetailResponse[]>(
        '/api/quizzes/my-quizzes'
      );

      const items = Array.isArray(data) ? data : [];
      if (items.length > 0) {
        const first = items[0];
        const total = Array.isArray(first.questions)
          ? first.questions.length
          : 0;
        setQuizzes([
          {
            id: first.quizSetId,
            title: first.title ?? `퀴즈 세트 ${first.quizSetId}`,
            description: first.description ?? `${total}개의 문제`,
            totalQuestions: total,
            creatorNickname: first.creatorNickname,
          },
        ]);
        setQuizStats((prev) => ({ ...prev, totalQuizzes: 1 }));
      } else {
        setQuizzes([]);
        setQuizStats((prev) => ({ ...prev, totalQuizzes: 0 }));
      }
    } catch (err) {
      console.error('내 퀴즈 조회 실패:', err);
      setQuizzes([]);
      setQuizStats((prev) => ({
        ...prev,
        totalQuizzes: 0,
      }));
    } finally {
      setIsQuizLoading(false);
    }
  };

  // 우정 점수 총합 조회
  const fetchTotalFriendshipScore = async () => {
    try {
      const response = await axiosInstance.get('/api/quizzes/scores');

      // 응답 데이터 구조를 안전하게 처리
      const items = Array.isArray(response.data)
        ? response.data
        : Array.isArray(response.data?.items)
          ? response.data.items
          : [];

      const totalScore = items.reduce(
        (
          sum: number,
          score: { friendId: number; friendNickname: string; score: number }
        ) => sum + score.score,
        0
      );

      setQuizStats((prev) => ({
        ...prev,
        totalFriendshipScore: totalScore,
      }));
    } catch (err) {
      console.error('우정 점수 총합 조회 실패:', err);
      // 에러 발생 시 기본값 설정
      setQuizStats((prev) => ({
        ...prev,
        totalFriendshipScore: 0,
      }));
    }
  };

  // 퀴즈 만들기 페이지로 이동
  const handleCreateQuiz = () => {
    router.push('/front/game/guess-me/make-quiz');
  };

  // 랜덤 문제 10개 조회
  const fetchRandomQuestions = async () => {
    try {
      setIsRandomLoading(true);
      const response = await axiosInstance.get('/api/quizzes/question-random');

      // 응답 스키마를 안전하게 노멀라이즈
      const items = Array.isArray(response.data)
        ? response.data
        : Array.isArray((response.data as { items?: unknown[] })?.items)
          ? (response.data as { items: unknown[] }).items
          : [];

      setRandomQuestions(items as Question[]);
    } catch (err) {
      console.error('랜덤 문제 조회 실패:', err);
      setRandomQuestions([]);
    } finally {
      setIsRandomLoading(false);
    }
  };

  // 전체 문제 조회
  const fetchAllQuestions = async () => {
    try {
      setIsAllLoading(true);
      const response = await axiosInstance.get('/api/quizzes/question-all');

      // 응답 스키마를 안전하게 노멀라이즈
      const items = Array.isArray(response.data)
        ? response.data
        : Array.isArray((response.data as { items?: unknown[] })?.items)
          ? (response.data as { items: unknown[] }).items
          : [];

      setAllQuestions(items as Question[]);
    } catch (err) {
      console.error('전체 문제 조회 실패:', err);
      setAllQuestions([]);
    } finally {
      setIsAllLoading(false);
    }
  };

  // 랜덤 문제 더보기
  const handleShowMoreRandom = () => {
    setShowMoreRandom(true);
  };

  // 랜덤 문제 접기
  const handleShowLessRandom = () => {
    setShowMoreRandom(false);
  };

  // 전체 문제 더보기
  const handleShowMoreAll = () => {
    setShowMoreAll(true);
  };

  // 전체 문제 접기
  const handleShowLessAll = () => {
    setShowMoreAll(false);
  };

  // 받은 쪽지 개수 조회
  const fetchReceivedMessagesCount = async () => {
    try {
      const response = await axiosInstance.get('/api/messages/read/all');
      setReceivedMessagesCount(response.data.length);
    } catch (err) {
      console.error('받은 쪽지 개수 조회 실패:', err);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError('');
      try {
        await Promise.all([
          fetchSchedules(),
          fetchFriends(),
          fetchFriendRequests(),
          fetchReceivedMessagesCount(),
          fetchGroups(),
          fetchMyQuizzes(),
          fetchTotalFriendshipScore(),
          fetchRandomQuestions(),
          fetchAllQuestions(),
        ]);
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

  // 그룹 조회
  const fetchGroups = async () => {
    try {
      const token = getCookieValue('accessToken');
      const response = await axiosInstance.get('/api/groups/mygroups', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setGroups(response.data);
    } catch (err) {
      console.error('그룹 목록 조회 실패:', err);
    }
  };

  return (
    <div className="my-home-page py-4 px-4 pt-20 pb-20 mx-auto rounded-lg bg-gray-100 overflow-y-auto">
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
          <div className="flex gap-4">
            <Link
              href="/front/my-home/friend-list"
              className="text-sm text-gray-500 hover:text-gray-700"
            >
              친구 수 <span>{friends.length}</span>
            </Link>
            <Link
              href="/front/my-home/friend-requests"
              className="text-sm text-gray-500 hover:text-gray-700"
            >
              받은 친구 요청 <span>{friendRequests.length}</span>
            </Link>
          </div>
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
            {receivedMessagesCount}
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

      {/* 퀴즈 섹션 */}
      <div className="quiz-section bg-white p-6 rounded-lg shadow-sm mb-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">🧩 나의 퀴즈</h2>
          <Button
            type="button"
            onClick={handleCreateQuiz}
            className="bg-purple-600 text-white text-sm px-4 py-2"
          >
            퀴즈 만들기
          </Button>
        </div>

        {/* 퀴즈 통계 */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="text-center p-3 bg-purple-50 rounded-lg">
            <div className="text-2xl font-bold text-purple-600">
              {quizStats.totalQuizzes}
            </div>
            <div className="text-sm text-gray-600">만든 퀴즈</div>
          </div>
          <div className="text-center p-3 bg-green-50 rounded-lg">
            <div className="text-2xl font-bold text-green-600">
              {quizStats.totalFriendshipScore}
            </div>
            <div className="text-sm text-gray-600">총 우정 점수</div>
          </div>
        </div>

        {/* 퀴즈 목록 */}
        {isQuizLoading ? (
          <div className="text-center py-4">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-purple-600 mx-auto"></div>
            <p className="mt-2 text-gray-500 text-sm">퀴즈를 불러오는 중...</p>
          </div>
        ) : quizzes.length === 0 ? (
          <div className="text-center py-6 text-gray-500">
            <p>아직 만든 퀴즈가 없어요 😢</p>
            <p className="text-sm mt-1">
              친구들과 우정을 쌓을 퀴즈를 만들어보세요!
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {quizzes.map((quiz) => (
              <div
                key={quiz.id}
                className="p-3 bg-gray-50 rounded-lg border border-gray-200"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-800">{quiz.title}</h4>
                    <p className="text-sm text-gray-600 mt-1">
                      {quiz.description}
                    </p>
                    <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                      <span>문제 수: {quiz.totalQuestions}개</span>
                      <span>생성자: {quiz.creatorNickname}</span>
                    </div>
                  </div>
                  <div className="ml-3">
                    <Button
                      type="button"
                      onClick={() =>
                        router.push(
                          `/front/game/guess-me/make-quiz?edit=${quiz.id}`
                        )
                      }
                      className="bg-blue-600 text-white text-sm px-3 py-1"
                    >
                      수정
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 랜덤 문제 섹션 */}
      <div className="random-questions bg-white p-6 rounded-lg shadow-sm mb-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">🎲 랜덤 문제</h2>
          <Button
            type="button"
            onClick={fetchRandomQuestions}
            className="bg-orange-600 text-white text-sm px-4 py-2"
          >
            새로고침
          </Button>
        </div>

        {isRandomLoading ? (
          <div className="text-center py-4">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-orange-600 mx-auto"></div>
            <p className="mt-2 text-gray-500 text-sm">
              랜덤 문제를 불러오는 중...
            </p>
          </div>
        ) : randomQuestions.length === 0 ? (
          <div className="text-center py-6 text-gray-500">
            <p>랜덤 문제를 불러올 수 없습니다.</p>
            <p className="text-sm mt-1">새로고침 버튼을 눌러보세요!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {randomQuestions
              .slice(0, showMoreRandom ? randomQuestions.length : 5)
              .map((question, index) => (
                <div
                  key={question.id}
                  className="p-3 bg-orange-50 rounded-lg border border-orange-200"
                >
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-800 mb-2">
                      문제 {index + 1}: {question.content}
                    </h4>
                    <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
                      <div>A. {question.option1}</div>
                      <div>B. {question.option2}</div>
                      <div>C. {question.option3}</div>
                      <div>D. {question.option4}</div>
                    </div>
                  </div>
                </div>
              ))}

            {/* 더보기/접기 버튼 */}
            {randomQuestions.length > 5 && (
              <div className="text-center mt-4">
                <Button
                  onClick={
                    showMoreRandom ? handleShowLessRandom : handleShowMoreRandom
                  }
                  className="bg-orange-500 text-white text-sm px-4 py-2"
                >
                  {showMoreRandom ? '접기' : '더보기'}
                </Button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* 전체 문제 섹션 */}
      <div className="all-questions bg-white p-6 rounded-lg shadow-sm mb-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">📚 전체 문제</h2>
          <div className="flex gap-2">
            <Button
              type="button"
              onClick={fetchAllQuestions}
              className="bg-indigo-600 text-white text-sm px-4 py-2"
            >
              새로고침
            </Button>
            <Button
              type="button"
              onClick={() => router.push('/front/game/guess-me/all-questions')}
              className="bg-green-600 text-white text-sm px-4 py-2"
            >
              전체 보기
            </Button>
          </div>
        </div>

        {isAllLoading ? (
          <div className="text-center py-4">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-indigo-600 mx-auto"></div>
            <p className="mt-2 text-gray-500 text-sm">
              전체 문제를 불러오는 중...
            </p>
          </div>
        ) : allQuestions.length === 0 ? (
          <div className="text-center py-6 text-gray-500">
            <p>전체 문제를 불러올 수 없습니다.</p>
            <p className="text-sm mt-1">새로고침 버튼을 눌러보세요!</p>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="text-center text-sm text-gray-600 mb-3">
              총 {allQuestions.length}개의 문제가 있습니다
            </div>
            {allQuestions
              .slice(0, showMoreAll ? allQuestions.length : 3)
              .map((question, index) => (
                <div
                  key={question.id}
                  className="p-3 bg-indigo-50 rounded-lg border border-indigo-200"
                >
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-800 mb-2">
                      문제 {index + 1}: {question.content}
                    </h4>
                    <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
                      <div>A. {question.option1}</div>
                      <div>B. {question.option2}</div>
                      <div>C. {question.option3}</div>
                      <div>D. {question.option4}</div>
                    </div>
                  </div>
                </div>
              ))}

            {/* 더보기/접기 버튼 */}
            {allQuestions.length > 3 && (
              <div className="text-center mt-4">
                <Button
                  onClick={showMoreAll ? handleShowLessAll : handleShowMoreAll}
                  className="bg-indigo-500 text-white text-sm px-4 py-2"
                >
                  {showMoreAll ? '접기' : '더보기'}
                </Button>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="my-groups bg-white p-4 rounded-lg shadow-sm">
        <h3 className="text-lg font-semibold mb-4">내 그룹 목록</h3>
        {groups.length === 0 ? (
          <p className="text-gray-500">가입된 그룹이 없습니다.</p>
        ) : (
          groups.slice(0, 3).map((group) => (
            <div
              key={group.groupId}
              className="group-item bg-purple-50 p-3 rounded mb-2 cursor-pointer hover:bg-purple-100 transition-colors border border-purple-100"
              onClick={() =>
                router.push(
                  `/front/my-home/group/detail?groupId=${group.groupId}`
                )
              }
            >
              <div className="font-medium text-gray-800">{group.groupName}</div>
              {/* <div className="text-sm text-gray-600">{group.description}</div> */}
            </div>
          ))
        )}

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
