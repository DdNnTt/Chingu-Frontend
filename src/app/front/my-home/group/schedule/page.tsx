'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Input from '@/components/common/Input';
import Button from '@/components/common/Button';
import Calendar from 'react-calendar';

// 쿠키에서 특정 키 값을 가져오는 유틸 함수
function getCookieValue(key: string) {
  if (typeof document === 'undefined') return '';
  const matches = document.cookie.match(new RegExp('(^| )' + key + '=([^;]+)'));
  return matches ? decodeURIComponent(matches[2]) : '';
}

// accessToken(JWT)에서 닉네임 디코딩
function parseJwt(token: string) {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (err) {
    console.error('JWT 파싱 오류:', err);
    return null;
  }
}

type ValuePiece = Date | null;
type Value = ValuePiece | [ValuePiece, ValuePiece];

export default function GroupSchedule() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const groupId = searchParams.get('groupId');
  const [nickname, setNickname] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [value, setValue] = useState<Value>(new Date());
  const [hour, setHour] = useState('09');
  const [minute, setMinute] = useState('00');

  useEffect(() => {
    const token = getCookieValue('accessToken');
    const payload = parseJwt(token);
    if (payload?.nickname) {
      setNickname(payload.nickname);
    } else {
      console.log('닉네임이 JWT에 없습니다.');
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!groupId) {
      alert('그룹 ID가 없습니다.');
      return;
    }

    // 입력값 검증
    if (!nickname.trim()) {
      alert('작성자 닉네임이 없습니다.');
      return;
    }
    if (!title.trim()) {
      alert('제목을 입력해주세요.');
      return;
    }
    if (!description.trim()) {
      alert('본문을 입력해주세요.');
      return;
    }
    if (!value) {
      alert('날짜를 선택해주세요.');
      return;
    }

    const token = getCookieValue('accessToken');
    const scheduleDate = formatScheduleDate(
      Array.isArray(value) ? value[0]! : value!,
      hour,
      minute
    );

    try {
      const res = await fetch(`/api/groups/${groupId}/schedules/add`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title,
          description,
          scheduleDate,
        }),
      });

      if (!res.ok) throw new Error('일정 등록 실패');

      alert('일정이 성공적으로 추가되었습니다!');
      router.back();
    } catch (err) {
      console.error('[일정 등록 실패]', err);
      alert('일정 등록 중 오류가 발생했습니다.');
    }
  };

  const handleDateChange = (val: Value) => {
    setValue(val);
  };

  const formatScheduleDate = (date: Date, hour: string, minute: string) => {
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const dd = String(date.getDate()).padStart(2, '0');
    const hh = hour.padStart(2, '0');
    const mi = minute.padStart(2, '0');
    return `${yyyy}-${mm}-${dd}T${hh}:${mi}:00`;
  };

  return (
    <div className="member-list-page py-4 px-4 pt-20 mx-auto rounded-lg bg-gray-100 min-h-screen">
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
          그룹 일정 추가
        </h2>
      </div>

      <form
        onSubmit={handleSubmit}
        className="space-y-4 md:max-h-[74%] md:overflow-y-auto scroll-overlay"
      >
        {/* (필수/자동 입력) 작성자 닉네임 */}
        <div className="mb-4 p-4 bg-white rounded-lg shadow-sm gap-2">
          <label className="block mb-1 font-medium">작성자 닉네임</label>
          <Input
            type="text"
            placeholder="(필수 / 자동 입력) 작성자 닉네임"
            value={nickname}
            disabled
          />
        </div>

        {/* 제목 */}
        <div className="mb-4 p-4 bg-white rounded-lg shadow-sm gap-2">
          <label className="block mb-1 font-medium">제목</label>
          <Input
            type="text"
            placeholder="제목을 입력해주세요."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        {/* 본문 */}
        <div className="mb-4 p-4 bg-white rounded-lg shadow-sm gap-2">
          <label className="block mb-1 font-medium">본문</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="본문을 입력해주세요."
            className="mt-1 block w-full px-3 py-2 border bg-[#f3f3f5] rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-indigo-300"
          />
        </div>

        {/* 날짜&시간 선택 */}
        <div className="mb-4 p-4 bg-white rounded-lg shadow-sm gap-2">
          <p className="mb-1 font-medium">날짜 및 시간 선택</p>
          {/* 날짜 선택 */}
          <Calendar
            value={value}
            onChange={handleDateChange}
            calendarType="iso8601"
            locale="ko-KR"
            formatDay={() => ''}
            tileClassName={({ date, view }) => {
              if (view !== 'month') return '';

              const day = date.getDay();
              if (day === 6) return 'weekday-saturday'; // 토요일
              return '';
            }}
            tileContent={({ date, view }) =>
              view === 'month' ? (
                <div
                  className={`color-round flex items-center justify-center mx-auto rounded-full w-[30px] h-[30px] ${
                    (Array.isArray(value)
                      ? value[0]?.toDateString()
                      : value?.toDateString()) === date.toDateString()
                      ? 'bg-[#baa8ff]'
                      : ''
                  }`}
                >
                  {date.getDate()}
                </div>
              ) : null
            }
          />
          {/* 시간 선택 */}
          <div className="mt-4 items-center text-sm w-full">
            <div className="flex items-center gap-2 w-full">
              {/* 시 선택 */}
              <div className="relative w-1/2">
                <select
                  id="hour"
                  className="w-full"
                  value={hour}
                  onChange={(e) => setHour(e.target.value)}
                >
                  {Array.from({ length: 24 }, (_, i) => {
                    const h = String(i).padStart(2, '0');
                    return <option key={h}>{h}</option>;
                  })}
                </select>
                {/* 보라색 아이콘 (커스텀) */}
                <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2">
                  <svg
                    className="w-4 h-4 text-main-color"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </div>
              </div>

              <span className="text-lg font-semibold">:</span>

              {/* 분 선택 */}
              <div className="relative w-1/2">
                <select
                  id="minute"
                  className="w-full"
                  value={minute}
                  onChange={(e) => setMinute(e.target.value)}
                >
                  {[
                    '00',
                    '05',
                    '10',
                    '15',
                    '20',
                    '25',
                    '30',
                    '35',
                    '40',
                    '45',
                    '50',
                    '55',
                  ].map((m) => (
                    <option key={m}>{m}</option>
                  ))}
                </select>
                <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2">
                  <svg
                    className="w-4 h-4 text-main-color"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 일정 추가 버튼 */}
        <Button type="submit" className="w-full">
          일정 추가
        </Button>
      </form>
    </div>
  );
}
