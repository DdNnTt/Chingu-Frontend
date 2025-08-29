'use client';

import { useEffect, useState } from 'react';
import AdminGuard from '../components/AdminGuard';
import AdminLayout from '../components/layout/AdminLayout';
import axiosInstance from '@/libs/axios';
import MemberSearch from './components/MemberSearch';
import MemberActions from './components/MemberActions';

interface Member {
  id: string;
  email: string;
  nickname: string;
  createdAt: string;
  lastLoginAt?: string;
  isActive: boolean;
  groupCount: number;
}

export default function AdminMember() {
  const [members, setMembers] = useState<Member[]>([]);
  const [filteredMembers, setFilteredMembers] = useState<Member[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const ITEMS_PER_PAGE = 10;

  useEffect(() => {
    fetchMembers();
  }, [currentPage]);

  useEffect(() => {
    // 검색어가 변경될 때마다 필터링
    if (searchKeyword.trim() === '') {
      setFilteredMembers(members);
    } else {
      const filtered = members.filter(
        (member) =>
          member.email.toLowerCase().includes(searchKeyword.toLowerCase()) ||
          member.nickname.toLowerCase().includes(searchKeyword.toLowerCase())
      );
      setFilteredMembers(filtered);
    }
    setCurrentPage(1);
  }, [searchKeyword, members]);

  const fetchMembers = async () => {
    try {
      setIsLoading(true);
      const response = await axiosInstance.get('/api/admin/users');
      const fetchedMembers = response.data.map(
        (
          user: {
            id: string;
            email: string;
            nickname?: string;
            createdAt: string;
            lastLoginAt?: string;
            isActive?: boolean;
            groups?: { id: string; name: string }[];
          },
          index: number
        ) => ({
          id: user.id || `user-${index}`,
          email: user.email,
          nickname: user.nickname || '닉네임 없음',
          createdAt: new Date(user.createdAt).toLocaleDateString('ko-KR'),
          lastLoginAt: user.lastLoginAt
            ? new Date(user.lastLoginAt).toLocaleDateString('ko-KR')
            : '로그인 기록 없음',
          isActive: user.isActive !== false,
          groupCount: user.groups?.length || 0,
        })
      );

      setMembers(fetchedMembers);
      setFilteredMembers(fetchedMembers);
      setTotalPages(Math.ceil(fetchedMembers.length / ITEMS_PER_PAGE));
    } catch (error) {
      console.error('회원 목록 가져오기 실패:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (keyword: string) => {
    setSearchKeyword(keyword);
  };

  const handleDeleteMembers = async () => {
    try {
      // 선택된 회원들 삭제
      for (const memberId of selectedMembers) {
        await axiosInstance.delete(`/api/admin/users/${memberId}`);
      }

      // 성공적으로 삭제된 후 목록 새로고침
      await fetchMembers();
      setSelectedMembers([]);
      setShowDeleteModal(false);

      alert('선택된 회원이 삭제되었습니다.');
    } catch (error) {
      console.error('회원 삭제 실패:', error);
      alert('회원 삭제 중 오류가 발생했습니다.');
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      const currentPageMembers = filteredMembers.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
      );
      setSelectedMembers(currentPageMembers.map((m) => m.id));
    } else {
      setSelectedMembers([]);
    }
  };

  const handleSelectMember = (memberId: string, checked: boolean) => {
    if (checked) {
      setSelectedMembers((prev) => [...prev, memberId]);
    } else {
      setSelectedMembers((prev) => prev.filter((id) => id !== memberId));
    }
  };

  const paginatedMembers = filteredMembers.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <AdminGuard>
      <AdminLayout>
        <div className="h-full overflow-y-auto">
          {/* 페이지 헤더 */}
          <div className="mb-6 text-center">
            <h1 className="text-2xl font-semibold text-gray-900 mb-2">
              회원 관리
            </h1>
            <p className="text-gray-600">
              전체 회원 목록을 조회하고 관리할 수 있습니다.
            </p>
          </div>

          {/* 검색 및 액션 바 */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <MemberSearch onSearch={handleSearch} />

              <div className="flex items-center gap-2">
                {selectedMembers.length > 0 && (
                  <button
                    onClick={() => setShowDeleteModal(true)}
                    className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors text-sm"
                  >
                    선택 삭제 ({selectedMembers.length})
                  </button>
                )}
                <button
                  onClick={fetchMembers}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm"
                >
                  새로고침
                </button>
              </div>
            </div>
          </div>

          {/* 회원 목록 테이블 */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            {isLoading ? (
              <div className="p-8 text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-600">회원 목록을 불러오는 중...</p>
              </div>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          <input
                            type="checkbox"
                            checked={
                              selectedMembers.length ===
                                paginatedMembers.length &&
                              paginatedMembers.length > 0
                            }
                            onChange={(e) => handleSelectAll(e.target.checked)}
                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          />
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          회원 정보
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          가입일
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          최근 로그인
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          그룹 수
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          상태
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          액션
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {paginatedMembers.map((member, index) => (
                        <tr
                          key={member.id || `member-${index}`}
                          className="hover:bg-gray-50"
                        >
                          <td className="px-6 py-4 whitespace-nowrap">
                            <input
                              type="checkbox"
                              checked={selectedMembers.includes(member.id)}
                              onChange={(e) =>
                                handleSelectMember(member.id, e.target.checked)
                              }
                              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            />
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div>
                              <div className="text-sm font-medium text-gray-900">
                                {member.nickname}
                              </div>
                              <div className="text-sm text-gray-500">
                                {member.email}
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {member.createdAt}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {member.lastLoginAt}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {member.groupCount}개
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span
                              className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                member.isActive
                                  ? 'bg-green-100 text-green-800'
                                  : 'bg-red-100 text-red-800'
                              }`}
                            >
                              {member.isActive ? '활성' : '비활성'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <MemberActions
                              member={member}
                              onDelete={() => {
                                setSelectedMembers([member.id]);
                                setShowDeleteModal(true);
                              }}
                            />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* 페이지네이션 */}
                {totalPages > 1 && (
                  <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
                    <div className="flex-1 flex justify-between sm:hidden">
                      <button
                        onClick={() =>
                          setCurrentPage((prev) => Math.max(prev - 1, 1))
                        }
                        disabled={currentPage === 1}
                        className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                      >
                        이전
                      </button>
                      <button
                        onClick={() =>
                          setCurrentPage((prev) =>
                            Math.min(prev + 1, totalPages)
                          )
                        }
                        disabled={currentPage === totalPages}
                        className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                      >
                        다음
                      </button>
                    </div>
                    <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                      <div>
                        <p className="text-sm text-gray-700">
                          총{' '}
                          <span className="font-medium">
                            {filteredMembers.length}
                          </span>
                          명의 회원 중{' '}
                          <span className="font-medium">
                            {(currentPage - 1) * ITEMS_PER_PAGE + 1}
                          </span>
                          -
                          <span className="font-medium">
                            {Math.min(
                              currentPage * ITEMS_PER_PAGE,
                              filteredMembers.length
                            )}
                          </span>
                          번째
                        </p>
                      </div>
                      <div>
                        <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                          {Array.from(
                            { length: totalPages },
                            (_, i) => i + 1
                          ).map((page, index) => (
                            <button
                              key={`page-${page}-${index}`}
                              onClick={() => setCurrentPage(page)}
                              className={`relative inline-flex items-center px-4 py-2 text-sm font-medium ${
                                currentPage === page
                                  ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                                  : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                              } border`}
                            >
                              {page}
                            </button>
                          ))}
                        </nav>
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>

          {/* 삭제 확인 모달 */}
          {showDeleteModal && (
            <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
              <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
                <div className="mt-3 text-center">
                  <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
                    <svg
                      className="h-6 w-6 text-red-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                      />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mt-4">
                    회원 삭제 확인
                  </h3>
                  <div className="mt-2 px-7 py-3">
                    <p className="text-sm text-gray-500">
                      선택된 {selectedMembers.length}명의 회원을
                      삭제하시겠습니까?
                    </p>
                    <p className="text-sm text-red-500 mt-2">
                      이 작업은 되돌릴 수 없습니다.
                    </p>
                  </div>
                  <div className="items-center px-4 py-3">
                    <button
                      onClick={handleDeleteMembers}
                      className="px-4 py-2 bg-red-600 text-white text-base font-medium rounded-md w-24 mr-2 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
                    >
                      삭제
                    </button>
                    <button
                      onClick={() => setShowDeleteModal(false)}
                      className="px-4 py-2 bg-gray-500 text-white text-base font-medium rounded-md w-24 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500"
                    >
                      취소
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="h-40"></div>
        </div>
      </AdminLayout>
    </AdminGuard>
  );
}
