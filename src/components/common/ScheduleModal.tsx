import { useEffect, useState } from 'react';

interface ScheduleDetail {
  scheduleId: number;
  groupId: number;
  nickname: string;
  title: string;
  description: string;
  scheduleDate: string; // ISO format
  createdAt: string;
}

interface ScheduleModalProps {
  scheduleId: number;
  groupId: string;
  onClose: () => void;
}

export default function ScheduleModal({
  scheduleId,
  groupId,
  onClose,
}: ScheduleModalProps) {
  const [detail, setDetail] = useState<ScheduleDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const token = document.cookie
      .split('; ')
      .find((row) => row.startsWith('accessToken='))
      ?.split('=')[1];

    if (!token) {
      setError('로그인이 필요합니다.');
      setLoading(false);
      return;
    }

    fetch(`/api/groups/${groupId}/schedules/${scheduleId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(async (res) => {
        const text = await res.text();
        try {
          const data = JSON.parse(text);
          if (!res.ok) throw new Error(data.message || '일정 조회 실패');
          setDetail(data);
        } catch (e) {
          console.error('[일정 파싱 오류]', e);
          setError('일정을 불러오는 중 문제가 발생했습니다.');
        }
      })
      .catch(() => setError('네트워크 오류'))
      .finally(() => setLoading(false));
  }, [groupId, scheduleId]);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black bg-opacity-40 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-sm px-5 py-6 relative">
        {/* 닫기 버튼 */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
          aria-label="닫기"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-5 h-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        <h3 className="text-lg font-bold mb-4 text-gray-800 text-center">
          일정 상세
        </h3>

        {loading ? (
          <div className="text-sm text-gray-400 text-center">
            불러오는 중...
          </div>
        ) : error ? (
          <div className="text-red-500 text-sm text-center">{error}</div>
        ) : detail ? (
          <div className="space-y-3 text-sm text-gray-700 font-bold">
            <div>
              <div className="px-2 font-medium main-color">작성자</div>
              <div className="bg-gray-100 px-3 py-2 rounded text-base mt-1">
                {detail.nickname}
              </div>
            </div>

            <div>
              <div className="px-2 font-medium main-color">제목</div>
              <div className="bg-gray-100 px-3 py-2 rounded text-base mt-1">
                {detail.title}
              </div>
            </div>

            <div>
              <div className="px-2 font-medium main-color">본문</div>
              <div className="bg-gray-100 px-3 py-2 rounded whitespace-pre-line text-base mt-1">
                {detail.description}
              </div>
            </div>

            <div>
              <div className="px-2 font-medium main-color">날짜 & 시간</div>
              <div className="bg-gray-100 px-3 py-2 rounded text-base mt-1">
                {new Date(detail.scheduleDate).toLocaleString()}
              </div>
            </div>
          </div>
        ) : (
          <div className="text-sm text-gray-400 text-center">
            일정 정보 없음
          </div>
        )}
      </div>
    </div>
  );
}
