'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function AlbumAdd() {
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
          추억 앨범 상세
        </h2>
      </div>

      {/* 그룹 이름 */}
      <div className="bg-white p-4 rounded-md shadow mb-4 flex items-center justify-between">
        <h1 className="text-xl font-bold">추억 앨범</h1>
        <Link
          href="/front/my-home/member/list"
          className="text-sm px-2 py-1 rounded text-white bg-[#9477ff] hover:bg-[#6845f5]"
        >
          글쓰기
        </Link>
      </div>
    </div>
  );
}
