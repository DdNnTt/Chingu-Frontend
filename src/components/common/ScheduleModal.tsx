import { useEffect, useState } from 'react';

interface ScheduleDetail {
  scheduleId: number;
  groupId: number;
  nickname: string;
  title: string;
  description: string;
  scheduleDate: string;
  createdAt: string;
}

interface ScheduleModalProps {
  scheduleId: number;
  groupId: string;
  onClose: () => void;
  onDeleteSuccess: () => void;
}

export default function ScheduleModal({
  scheduleId,
  groupId,
  onClose,
  onDeleteSuccess,
}: ScheduleModalProps) {
  const [detail, setDetail] = useState<ScheduleDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleting, setDeleting] = useState(false);

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

  const handleDelete = async () => {
    if (!confirm('정말 이 일정을 삭제하시겠습니까?')) return;

    const token = document.cookie
      .split('; ')
      .find((row) => row.startsWith('accessToken='))
      ?.split('=')[1];

    if (!token) {
      alert('로그인이 필요합니다.');
      return;
    }

    setDeleting(true);

    try {
      const res = await fetch(
        `/api/groups/${groupId}/schedules/${scheduleId}/delete`,
        {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.message || '삭제 실패');
      }

      alert('일정이 삭제되었습니다.');
      onClose(); // 모달 닫기
      onDeleteSuccess();
    } catch (err) {
      alert(err instanceof Error ? err.message : '삭제 중 오류 발생');
    } finally {
      setDeleting(false);
    }
  };

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
                {(() => {
                  // 백엔드에서 받은 scheduleDate와 로컬 스토리지의 시간 정보를 조합하여 사용
                  const dateStr = detail.scheduleDate;

                  // 로컬 스토리지에서 시간 정보 확인
                  const storedTimeInfo = localStorage.getItem(
                    `schedule_time_${detail.scheduleId}`
                  );
                  let timeStr = '00:00:00';

                  if (storedTimeInfo) {
                    try {
                      const timeInfo = JSON.parse(storedTimeInfo);
                      timeStr = timeInfo.time || '00:00:00';
                      console.log(
                        '[일정 표시] 로컬 스토리지 시간 정보:',
                        timeInfo
                      );
                    } catch (e) {
                      console.log('[일정 표시] 로컬 스토리지 파싱 오류:', e);
                    }
                  }

                  // 백엔드 응답에서 scheduleTime 필드가 있으면 우선 사용
                  const backendTime = (
                    detail as ScheduleDetail & { scheduleTime?: string }
                  ).scheduleTime;
                  if (backendTime && backendTime !== '00:00:00') {
                    timeStr = backendTime;
                    console.log(
                      '[일정 표시] 백엔드 scheduleTime 사용:',
                      backendTime
                    );
                  }

                  console.log('[일정 표시] 원본 scheduleDate:', dateStr);
                  console.log('[일정 표시] 최종 사용할 시간:', timeStr);
                  console.log('[일정 표시] detail 객체 전체:', detail);

                  // scheduleDate에서 날짜 부분만 추출 (T가 이미 있으면 날짜 부분만)
                  const dateOnly = dateStr.includes('T')
                    ? dateStr.split('T')[0]
                    : dateStr;

                  // 날짜와 시간을 조합하여 완전한 datetime 생성
                  const fullDateTime = `${dateOnly}T${timeStr}`;
                  console.log('[일정 표시] 추출된 날짜:', dateOnly);
                  console.log('[일정 표시] 조합된 datetime:', fullDateTime);

                  const date = new Date(fullDateTime);
                  console.log('[일정 표시] Date 객체:', date);
                  console.log('[일정 표시] Date toString:', date.toString());

                  const result = date.toLocaleString('ko-KR', {
                    year: 'numeric',
                    month: '2-digit',
                    day: '2-digit',
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: false,
                    timeZone: 'Asia/Seoul',
                  });

                  console.log('[일정 표시] 최종 표시 결과:', result);
                  return result;
                })()}
              </div>
            </div>

            {/* 🗑 삭제 버튼 */}
            <div className="pt-4 flex justify-center">
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="text-white bg-red-500 hover:bg-red-600 px-4 py-2 rounded-lg text-sm font-semibold disabled:opacity-50"
              >
                {deleting ? '삭제 중...' : '삭제'}
              </button>
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
