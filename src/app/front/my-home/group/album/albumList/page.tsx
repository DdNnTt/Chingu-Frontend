'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState, Suspense } from 'react';
import Link from 'next/link';
import { getCookieValue } from '@/utils/cookie';
import Image from 'next/image';

type Album = {
  albumId: number;
  albumTitle: string;
  albumImage?: string;
  createdAt: string;
  // 호환성을 위한 추가 필드들
  memoryId?: number;
  description?: string;
  imageUrl?: string;
  title?: string;
  content?: string;
  location?: string;
  albumName?: string;
  memoryTitle?: string;
  albumContent?: string;
  memoryContent?: string;
  albumLocation?: string;
  memoryLocation?: string;
};

function AlbumListContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const groupId = searchParams.get('groupId');
  const [albums, setAlbums] = useState<Album[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!groupId) {
      setError('groupId가 없습니다.');
      setLoading(false);
      return;
    }

    const token = getCookieValue('accessToken');

    if (!token) {
      alert('로그인이 필요합니다.');
      router.push('/front/account/login');
      return;
    }

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
          console.log('[앨범 목록] API 응답 데이터:', data);
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
  }, [groupId, router]);

  return (
    <div className="group-detail-page py-24 px-4 mx-auto rounded-lg bg-gray-100">
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
          그룹 추억 앨범
        </h2>
      </div>

      {/* 추억 앨범 리스트 */}

      <div className="bg-white p-4 rounded-md shadow mb-4">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-xl font-bold">추억 앨범</h1>
          <Link
            href={`/front/my-home/group/album/add?groupId=${groupId}`}
            className="text-sm px-2 py-1 rounded text-white bg-[#9477ff] hover:bg-[#6845f5]"
          >
            글쓰기
          </Link>
        </div>
        {loading ? (
          <div className="text-center text-gray-500 text-sm py-8">
            불러오는 중...
          </div>
        ) : error ? (
          <div className="text-center text-red-500 text-sm py-8">{error}</div>
        ) : albums.length === 0 ? (
          <div className="text-center text-gray-500 text-sm py-8">
            앨범이 없습니다.
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {albums.map((album) => {
              return (
                <div
                  key={album.albumId || album.memoryId}
                  className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => {
                    router.push(
                      `/front/my-home/group/album/detail?groupId=${groupId}&albumId=${album.albumId || album.memoryId}`
                    );
                  }}
                >
                  {/* 이미지 영역 */}
                  <div className="h-28 bg-gray-100 relative">
                    {album.imageUrl ? (
                      <Image
                        src={album.imageUrl}
                        alt={album.description || '앨범 이미지'}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 50vw, 25vw"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full text-gray-400">
                        <svg
                          className="w-8 h-8"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2 2v12a2 2 0 002 2z"
                          />
                        </svg>
                      </div>
                    )}
                  </div>

                  {/* 앨범 정보 */}
                  <div className="p-3">
                    {/* 제목 */}
                    {/* <h3 className="text-sm font-semibold text-gray-900 mb-1 line-clamp-1">
                      {album.albumTitle || `앨범 #${album.albumId}`}
                    </h3> */}

                    {/* 설명 */}
                    <p className="text-xs text-gray-600 mb-2 line-clamp-2">
                      {album.content ||
                        album.albumContent ||
                        album.memoryContent ||
                        album.description ||
                        '내용 없음'}
                    </p>

                    {/* 위치 */}
                    {(album.location ||
                      album.albumLocation ||
                      album.memoryLocation) && (
                      <div className="flex items-center gap-1 text-xs text-gray-500">
                        <svg
                          className="w-3 h-3"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                        </svg>
                        <span className="line-clamp-1">
                          {album.location ||
                            album.albumLocation ||
                            album.memoryLocation}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default function AlbumList() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AlbumListContent />
    </Suspense>
  );
}
