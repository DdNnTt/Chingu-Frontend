'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function AlbumList() {
  const router = useRouter();

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
        <h2 className="text-2xl font-semibold text-center flex-1">
          그룹 추억 앨범
        </h2>
      </div>

      {/* 추억 앨범 리스트 */}
      <div className="bg-white p-4 rounded-md shadow mb-4">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-xl font-bold">추억 앨범</h1>
          <Link
            href="/front/my-home/member/list"
            className="text-sm px-2 py-1 rounded text-white bg-[#9477ff] hover:bg-[#6845f5]"
          >
            글쓰기
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-gray-200 h-28 rounded flex items-center justify-center text-sm text-gray-600">
            그룹 추억 앨범 리스트
          </div>
          <div className="bg-gray-200 h-28 rounded flex items-center justify-center text-sm text-gray-600">
            그룹 추억 앨범 리스트
          </div>
          <div className="bg-gray-200 h-28 rounded flex items-center justify-center text-sm text-gray-600">
            그룹 추억 앨범 리스트
          </div>
          <div className="bg-gray-200 h-28 rounded flex items-center justify-center text-sm text-gray-600">
            그룹 추억 앨범 리스트
          </div>
          <div className="bg-gray-200 h-28 rounded flex items-center justify-center text-sm text-gray-600">
            그룹 추억 앨범 리스트
          </div>
          <div className="bg-gray-200 h-28 rounded flex items-center justify-center text-sm text-gray-600">
            그룹 추억 앨범 리스트
          </div>
          <div className="bg-gray-200 h-28 rounded flex items-center justify-center text-sm text-gray-600">
            그룹 추억 앨범 리스트
          </div>
          <div className="bg-gray-200 h-28 rounded flex items-center justify-center text-sm text-gray-600">
            그룹 추억 앨범 리스트
          </div>
        </div>
      </div>
    </div>
  );
}
