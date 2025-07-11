'use client';

import Calendar from 'react-calendar';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

type Member = {
  userId: number;
  nickname: string;
};

type Album = {
  memoryId: number;
  description: string;
  imageUrl: string;
  createdAt: string;
};

type ValuePiece = Date | null;
type Value = ValuePiece | [ValuePiece, ValuePiece];

export default function GroupDetail() {
  const router = useRouter();
  const [groupName] = useState('그룹1');
  const [members, setMembers] = useState<Member[]>([]);
  const [albums, setAlbums] = useState<Album[]>([]);
  const [value, setValue] = useState<Value>(new Date());
  const [groupId, setGroupId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const handleDateChange = (val: Value) => {
    setValue(val);
  };

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const id = params.get('groupId');
    setGroupId(id);

    if (!id) {
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

    // 프록시 API 호출
    fetch(`/api/groups/${id}/albums`, {
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

    // 임시 멤버
    setMembers([
      { userId: 1, nickname: '철수' },
      { userId: 2, nickname: '영희' },
    ]);
  }, [router]);

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

      {/* 그룹 이름 */}
      <div className="bg-white p-4 rounded-md shadow mb-4 flex items-center justify-between">
        <h1 className="text-xl font-bold">{groupName}</h1>
        <Link
          href="/front/my-home/member/list"
          className="text-sm px-2 py-1 rounded text-white bg-[#9477ff] hover:bg-[#6845f5]"
        >
          멤버 {members.length}명
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

        <div className="bg-gray-100 h-28 overflow-hidden p-3">
          {loading ? (
            <div className="text-sm text-gray-400">불러오는 중...</div>
          ) : error ? (
            <div className="flex justify-center items-center h-full text-center text-sm text-red-500">
              {error}
            </div>
          ) : albums.length === 0 ? (
            <div className="text-sm text-gray-500">앨범이 없습니다.</div>
          ) : (
            <div className="grid grid-cols-3 gap-3">
              {albums.map((album) => (
                <div
                  key={album.memoryId}
                  className="relative bg-gray-100 h-28 rounded overflow-hidden shadow"
                >
                  {album.imageUrl ? (
                    <img
                      src={album.imageUrl}
                      alt={album.description}
                      className="object-cover w-full h-full"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full text-sm text-gray-500">
                      {album.description}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* 그룹 일정 */}
      <div className="bg-white p-4 rounded-md shadow">
        <div className="flex justify-between items-center mb-2">
          <h2 className="font-semibold">그룹 일정</h2>
          <button className="text-sm px-2 py-1 rounded text-white bg-[#9477ff] hover:bg-[#6845f5]">
            일정 추가
          </button>
        </div>

        {/* 달력 */}
        <div className="bg-gray-100 rounded p-4">
          <Calendar
            value={value}
            onChange={handleDateChange}
            calendarType="iso8601"
            locale="ko-KR"
            formatDay={() => ''}
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
        </div>
      </div>
    </div>
  );
}
