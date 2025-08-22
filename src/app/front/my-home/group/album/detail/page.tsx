'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import React, { useState, useEffect, Suspense } from 'react';
import Image from 'next/image';
import { getCookieValue } from '@/utils/cookie';

type AlbumDetail = {
  memoryId: number;
  description: string;
  imageUrl?: string;
  createdAt?: string;
  // 추가 필드들 (실제 API 응답에 따라)
  title?: string;
  albumTitle?: string;
  content?: string;
  albumContent?: string;
  location?: string;
  albumLocation?: string;
  memoryDate?: string;
  albumImage?: string;
  albumImage2?: string;
  albumImage3?: string;
  // 기타 가능한 필드들
  name?: string;
  place?: string;
  address?: string;
  // 백엔드에서 사용할 가능성이 높은 필드들
  albumName?: string;
  memoryTitle?: string;
  memoryContent?: string;
  memoryLocation?: string;
};

function AlbumDetailContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const groupId = searchParams.get('groupId');
  const albumId = searchParams.get('albumId');

  const [albumDetail, setAlbumDetail] = useState<AlbumDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // 토큰 상태 확인
  const accessToken = getCookieValue('accessToken');

  useEffect(() => {
    if (!groupId || !albumId || !accessToken) {
      setError('필요한 정보가 없습니다.');
      setLoading(false);
      return;
    }

    const fetchAlbumDetail = async () => {
      try {
        // 앨범 상세 정보 조회
        const response = await fetch(`/api/groups/${groupId}/albums`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        if (response.ok) {
          const albums = await response.json();
          console.log('[앨범 상세] API 응답:', albums);
          console.log('[앨범 상세] 찾는 albumId:', albumId);

          const album = albums.find(
            (a: AlbumDetail) => String(a.memoryId) === String(albumId)
          );

          if (album) {
            console.log('[앨범 상세] 찾은 앨범:', album);
            setAlbumDetail(album);
          } else {
            console.log(
              '[앨범 상세] 앨범을 찾을 수 없음. 사용 가능한 앨범들:',
              albums.map((a: AlbumDetail) => ({
                memoryId: a.memoryId,
                description: a.description,
              }))
            );
            setError('앨범을 찾을 수 없습니다.');
          }
        } else {
          setError('앨범 정보를 불러오는데 실패했습니다.');
        }
      } catch (err) {
        console.error('[앨범 상세 조회 오류]', err);
        setError('앨범 정보를 불러오는데 실패했습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchAlbumDetail();
  }, [groupId, albumId, accessToken]);

  // 날짜 포맷팅
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  // 이미지 URL 배열 생성
  const getImageUrls = (album: AlbumDetail) => {
    const urls = [];
    // 기본 imageUrl 필드 확인
    if (album.imageUrl) urls.push(album.imageUrl);
    // 추가 이미지 필드들 확인
    if (album.albumImage) urls.push(album.albumImage);
    if (album.albumImage2) urls.push(album.albumImage2);
    if (album.albumImage3) urls.push(album.albumImage3);
    return urls;
  };

  // 로딩 상태
  if (loading) {
    return (
      <div className="group-detail-page h-screen flex flex-col py-4 px-4 pt-20 mx-auto rounded-lg bg-gray-100">
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
            앨범 상세
          </h2>
        </div>
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#9477ff] mx-auto mb-4"></div>
            <p className="text-gray-600">앨범 정보를 불러오는 중...</p>
          </div>
        </div>
      </div>
    );
  }

  // 에러 상태
  if (error || !albumDetail) {
    return (
      <div className="group-detail-page h-screen flex flex-col py-4 px-4 pt-20 mx-auto rounded-lg bg-gray-100">
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
            앨범 상세
          </h2>
        </div>
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="text-6xl mb-4">⚠️</div>
            <h3 className="text-xl font-semibold mb-2">
              앨범을 찾을 수 없습니다
            </h3>
            <p className="text-gray-600 mb-4">{error}</p>
            <button
              onClick={() => router.back()}
              className="bg-[#9477ff] hover:bg-[#6845f5] text-white px-6 py-2 rounded-lg"
            >
              돌아가기
            </button>
          </div>
        </div>
      </div>
    );
  }

  const imageUrls = getImageUrls(albumDetail);

  return (
    <div className="group-detail-page h-screen flex flex-col py-4 px-4 pt-20 mx-auto rounded-lg bg-gray-100">
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
        <h2 className="text-2xl font-semibold text-center flex-1">앨범 상세</h2>
      </div>

      <div className="space-y-4 flex-1 overflow-y-auto scroll-overlay pb-20">
        {/* 제목 */}
        <div className="mb-4 p-4 bg-white rounded-lg shadow-sm">
          <label className="block mb-2 font-medium text-gray-700">제목</label>
          <div className="text-lg font-semibold text-gray-900">
            {albumDetail.title ||
              albumDetail.albumTitle ||
              albumDetail.memoryTitle ||
              albumDetail.albumName ||
              albumDetail.name ||
              `앨범 #${albumDetail.memoryId}`}
          </div>
        </div>

        {/* 설명 */}
        <div className="mb-4 p-4 bg-white rounded-lg shadow-sm">
          <label className="block mb-2 font-medium text-gray-700">설명</label>
          <div className="text-gray-800 whitespace-pre-wrap leading-relaxed">
            {albumDetail.content ||
              albumDetail.albumContent ||
              albumDetail.memoryContent ||
              albumDetail.description}
          </div>
        </div>

        {/* 이미지 */}
        {imageUrls.length > 0 && (
          <div className="mb-4 p-4 bg-white rounded-lg shadow-sm">
            <label className="block mb-2 font-medium text-gray-700">
              이미지 ({imageUrls.length}장)
            </label>
            <div className="w-full">
              <div className="overflow-x-auto">
                <div
                  className="flex gap-2 py-2"
                  style={{ width: `${imageUrls.length * 120}px` }}
                >
                  {imageUrls.map((imageUrl, index) => (
                    <div
                      key={index}
                      className="relative flex-shrink-0 w-28 h-28"
                    >
                      <Image
                        src={imageUrl}
                        alt={`앨범 이미지 ${index + 1}`}
                        width={112}
                        height={112}
                        className="w-full h-full rounded-lg object-cover border border-gray-200"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 위치 */}
        <div className="mb-4 p-4 bg-white rounded-lg shadow-sm">
          <label className="block mb-2 font-medium text-gray-700">위치</label>
          <div className="text-gray-800 flex items-center gap-2">
            <svg
              className="w-4 h-4 text-gray-500"
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
            <span className="text-gray-600">
              {albumDetail.location ||
                albumDetail.albumLocation ||
                albumDetail.memoryLocation ||
                albumDetail.place ||
                albumDetail.address ||
                '위치 정보 없음'}
            </span>
          </div>
        </div>

        {/* 추억 날짜 */}
        {albumDetail.memoryDate && (
          <div className="mb-4 p-4 bg-white rounded-lg shadow-sm">
            <label className="block mb-2 font-medium text-gray-700">
              추억 날짜
            </label>
            <div className="text-gray-800 flex items-center gap-2">
              <svg
                className="w-4 h-4 text-gray-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              {formatDate(albumDetail.memoryDate)}
            </div>
          </div>
        )}

        {/* 생성일 */}
        {albumDetail.createdAt && (
          <div className="mb-4 p-4 bg-white rounded-lg shadow-sm">
            <label className="block mb-2 font-medium text-gray-700">
              생성일
            </label>
            <div className="text-gray-600 text-sm">
              {formatDate(albumDetail.createdAt)}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function AlbumDetail() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AlbumDetailContent />
    </Suspense>
  );
}
