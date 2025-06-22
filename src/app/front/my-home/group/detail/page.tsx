'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

type Member = {
  userId: number;
  nickname: string;
};

type Album = {
  id: number;
  title: string;
  imageUrl: string;
};

export default function GroupDetail() {
  const router = useRouter();
  const [groupName] = useState('그룹1');
  const [members, setMembers] = useState<Member[]>([]);
  const [albums, setAlbums] = useState<Album[]>([]);

  useEffect(() => {
    // 샘플 데이터 (추후 API 연동)
    setMembers([
      { userId: 1, nickname: '철수' },
      { userId: 2, nickname: '영희' },
    ]);

    setAlbums([
      {
        id: 1,
        title: '그룹 추억 앨범 리스트',
        imageUrl: '', // 실제 이미지가 있다면 대체
      },
    ]);
  }, []);

  return (
    <div className="group-detail-page py-4 px-4 pt-20 mx-auto rounded-lg bg-gray-100">
      <h2 className="text-2xl font-semibold text-center flex-1 mb-6">
        그룹 상세
      </h2>
      {/* 그룹 이름 */}
      <div className="bg-white p-4 rounded-md shadow mb-4 flex items-center justify-between">
        <h1 className="text-xl font-bold">{groupName}</h1>
        <button className="text-sm px-2 py-1 bg-gray-300 rounded hover:bg-gray-400">
          멤버 {members.length}명
        </button>
      </div>

      {/* 그룹 추억 앨범 */}
      <div className="bg-white p-4 rounded-md shadow mb-4">
        <div className="flex justify-between items-center mb-2">
          <h2 className="font-semibold">그룹 추억 앨범</h2>
          <button
            onClick={() => router.push('/front/my-home/group/album/add')}
            className="text-sm px-2 py-1 bg-gray-300 rounded hover:bg-gray-400"
          >
            앨범 추가
          </button>
        </div>
        {albums.length === 0 ? (
          <div className="text-sm text-gray-500">앨범이 없습니다.</div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {albums.map((album) => (
              <div
                key={album.id}
                className="bg-gray-200 h-32 rounded flex items-center justify-center text-sm text-gray-600"
              >
                {album.title}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 그룹 일정 */}
      <div className="bg-white p-4 rounded-md shadow">
        <div className="flex justify-between items-center mb-2">
          <h2 className="font-semibold">그룹 일정</h2>
          <button className="text-sm px-2 py-1 bg-gray-300 rounded hover:bg-gray-400">
            일정 추가
          </button>
        </div>

        {/* 달력 영역 (예시: 그냥 static 달력 구조) */}
        <div className="bg-gray-100 rounded p-4">
          <div className="text-center mb-2 font-medium">June 2021</div>
          <div className="grid grid-cols-7 gap-1 text-sm text-center">
            {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((d) => (
              <div key={d} className="font-bold text-gray-600">
                {d}
              </div>
            ))}
            {Array.from({ length: 30 }, (_, i) => (
              <div
                key={i}
                className="py-1 rounded hover:bg-blue-100 cursor-pointer"
              >
                {i + 1}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
