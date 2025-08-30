'use client';

import { useState } from 'react';

interface GroupActionsProps {
  onDelete: () => void;
}

export default function GroupActions({ onDelete }: GroupActionsProps) {
  const [showDropdown, setShowDropdown] = useState(false);

  // 현재 백엔드에서 지원하지 않는 기능들은 제거
  // 상세보기, 상태 토글, 멤버 관리, 그룹 수정 기능은 백엔드 API가 필요

  return (
    <div className="relative">
      <button
        onClick={() => setShowDropdown(!showDropdown)}
        className="text-gray-400 hover:text-gray-600 focus:outline-none focus:text-gray-600"
      >
        <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
          <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
        </svg>
      </button>

      {showDropdown && (
        <>
          {/* 드롭다운 배경 클릭 시 닫기 */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setShowDropdown(false)}
          />

          {/* 드롭다운 메뉴 */}
          <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-50 border border-gray-200">
            <div className="py-1">
              {/* 현재 백엔드에서 지원하는 기능만 남김 */}
              {/* 상세보기, 그룹 수정, 멤버 관리, 상태 토글은 백엔드 API가 필요하여 제거 */}

              <div className="border-t border-gray-100 my-1"></div>

              <button
                onClick={onDelete}
                className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 hover:text-red-700"
              >
                <svg
                  className="mr-3 h-4 w-4 text-red-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
                삭제
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
