'use client';

import Calendar from 'react-calendar';
import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import ScheduleModal from '@/components/common/ScheduleModal';

type Album = {
  memoryId: number;
  description: string;
  imageUrl: string;
  createdAt: string;
  title?: string;
  content?: string;
  location?: string;
};

type ScheduleItem = {
  scheduleId: number;
  scheduleDate: string;
};

type ValuePiece = Date | null;
type Value = ValuePiece | [ValuePiece, ValuePiece];

function GroupDetailContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [groupName, setGroupName] = useState<string>('');

  const [albums, setAlbums] = useState<Album[]>([]);
  const [value, setValue] = useState<Value>(new Date());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // 일정 팝업 상태
  const [schedules, setSchedules] = useState<ScheduleItem[]>([]);
  const [selectedScheduleId, setSelectedScheduleId] = useState<number | null>(
    null
  );
  const handleDateChange = (val: Value) => {
    setValue(val);
  };

  const groupId = searchParams.get('groupId');

  useEffect(() => {
    if (!groupId) {
      setError('groupId가 없습니다.');
      setLoading(false);
      return;
    }

    const token = document.cookie
      .split('; ')
      .find((row) => row.startsWith('accessToken='))
      ?.split('=')[1];

    if (!token) {
      alert('로그인이 필요합니다.');
      router.replace('/front/account/login');
      return;
    }

    // 그룹 상세 정보 가져오기
    fetch(`/api/groups/${groupId}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(async (res) => {
        if (res.ok) {
          const groupData = await res.json();
          setGroupName(groupData.groupName || '그룹명 없음');
        } else {
          console.error('[그룹 상세 조회 오류] 상태 코드:', res.status);
        }
      })
      .catch((err) => {
        console.error('[그룹 상세 조회 오류]', err);
      });

    // 앨범 정보 가져오기
    fetch(`/api/groups/${groupId}/albums`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(async (res) => {
        const text = await res.text();
        try {
          const data = JSON.parse(text);
          if (!res.ok) throw new Error(data.message || '앨범 조회 실패');
          if (!Array.isArray(data))
            throw new Error('응답 데이터가 배열이 아닙니다.');
          console.log('[그룹 상세 - 앨범] API 응답 데이터:', data);
          console.log('[그룹 상세 - 앨범] 첫 번째 앨범 구조:', data[0]);
          setAlbums(data);
        } catch (err) {
          console.error('[앨범 조회 오류]', err);
          setError('앨범 정보를 불러오는 데 실패했습니다.');
        }
      })
      .catch((err) => {
        console.error('[앨범 조회 오류]', err);
        setError('앨범 정보를 불러오는 데 실패했습니다.');
      })
      .finally(() => setLoading(false));

    // 일정 불러오기
    fetch(`/api/groups/${groupId}/schedules`, {
      headers: { Authorization: `Bearer ${token}` },
    }).then(async (res) => {
      const text = await res.text();
      const data = JSON.parse(text);
      setSchedules(data); // scheduleId 포함 배열 저장
    });
  }, [router, groupId]);

  // 헬퍼 함수 추가
  const getLocalDateString = (date: Date) =>
    `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;

  const fetchSchedules = async () => {
    if (!groupId) return;

    const token = document.cookie
      .split('; ')
      .find((row) => row.startsWith('accessToken='))
      ?.split('=')[1];

    if (!token) return;

    try {
      const res = await fetch(`/api/groups/${groupId}/schedules`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const text = await res.text();
      const data = JSON.parse(text);
      setSchedules(data);
    } catch (err) {
      console.error('일정 다시 불러오기 실패', err);
    }
  };

  return (
    <div className="group-detail-page py-4 px-4 pt-20 mx-auto rounded-lg bg-gray-100">
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
        <h2 className="text-2xl font-semibold text-center flex-1">그룹 상세</h2>
      </div>

      <div className="space-y-4 flex-1 overflow-y-auto scroll-overlay pb-20">
        {/* 그룹 이름 */}
        <div className="bg-white p-4 rounded-md shadow mb-4 flex items-center justify-between">
          <h1 className="text-xl font-bold">{groupName}</h1>
          <Link
            href={`/front/my-home/member/list?groupId=${groupId}`}
            className="text-sm px-2 py-1 rounded text-white bg-[#9477ff] hover:bg-[#6845f5]"
          >
            멤버 보기
          </Link>
        </div>

        {/* 그룹 추억 앨범 */}
        <div className="bg-white p-4 rounded-md shadow mb-4">
          <div className="flex justify-between items-center mb-2">
            <h2 className="font-semibold">그룹 추억 앨범</h2>
            <button
              onClick={() =>
                router.push(
                  `/front/my-home/group/album/albumList?groupId=${groupId}`
                )
              }
              className="text-sm px-2 py-1 rounded text-white bg-[#9477ff] hover:bg-[#6845f5]"
            >
              추억 앨범 보기
            </button>
          </div>

          <div className="bg-gray-100 overflow-hidden p-3">
            {loading ? (
              <div className="text-sm text-gray-400">불러오는 중...</div>
            ) : error ? (
              <div className="flex justify-center items-center h-full text-center text-sm text-red-500">
                {error}
              </div>
            ) : albums.length === 0 ? (
              <div className="text-sm text-gray-500">앨범이 없습니다.</div>
            ) : (
              <div className="overflow-x-auto h-full">
                <div
                  className="flex gap-3 py-1"
                  style={{ width: `${albums.length * 120}px` }}
                >
                  {albums.map((album) => (
                    <div
                      key={album.memoryId}
                      className="relative flex-shrink-0 w-28 h-28 bg-gray-100 rounded overflow-hidden shadow"
                    >
                      {album.imageUrl ? (
                        <Image
                          src={album.imageUrl}
                          alt={album.description}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full text-xs text-gray-500 p-1 text-center">
                          {album.description}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* 그룹 일정 */}
        <div className="bg-white p-4 rounded-md shadow">
          <div className="flex justify-between items-center mb-2">
            <h2 className="font-semibold">그룹 일정</h2>
            <Link
              href={`/front/my-home/group/schedule?groupId=${groupId}`}
              className="text-sm px-2 py-1 rounded text-white bg-[#9477ff] hover:bg-[#6845f5]"
            >
              일정 추가
            </Link>
          </div>

          {/* 달력 */}
          <div className="bg-gray-100 rounded p-4">
            <Calendar
              value={value}
              onChange={handleDateChange}
              calendarType="iso8601"
              locale="ko-KR"
              formatDay={() => ''}
              onClickDay={(date: Date) => {
                const dateStr = getLocalDateString(date);
                const matched = schedules.find((s) =>
                  s.scheduleDate.startsWith(dateStr)
                );
                if (matched) {
                  setSelectedScheduleId(matched.scheduleId);
                }
              }}
              tileClassName={({ date, view }) => {
                if (view !== 'month') return '';

                const day = date.getDay();
                if (day === 6) return 'weekday-saturday'; // 토요일
                return '';
              }}
              tileContent={({ date, view }) =>
                view === 'month' ? (
                  <div className="relative flex items-center justify-center mx-auto w-[30px] h-[30px]">
                    {/* 일정 있는 날짜: 빨간 배경 */}
                    {schedules.some((s) =>
                      s.scheduleDate.startsWith(getLocalDateString(date))
                    ) && (
                      <div className="absolute inset-0 rounded-full bg-[#ff9d9d] z-0" />
                    )}

                    {/* 날짜 텍스트 */}
                    <div
                      className={`
            rounded-full w-full h-full flex items-center justify-center z-10
            ${
              (Array.isArray(value)
                ? value[0]?.toDateString()
                : value?.toDateString()) === date.toDateString()
                ? 'bg-[#baa8ff]'
                : ''
            }
            ${
              schedules.some((s) =>
                s.scheduleDate.startsWith(getLocalDateString(date))
              )
                ? 'text-white'
                : ''
            }
          `}
                    >
                      {date.getDate()}
                    </div>
                  </div>
                ) : null
              }
            />
          </div>

          {/* 팝업 */}
          {selectedScheduleId && groupId && (
            <ScheduleModal
              scheduleId={selectedScheduleId}
              groupId={groupId}
              onClose={() => setSelectedScheduleId(null)}
              onDeleteSuccess={() => {
                setSelectedScheduleId(null);
                fetchSchedules();
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default function GroupDetail() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <GroupDetailContent />
    </Suspense>
  );
}
