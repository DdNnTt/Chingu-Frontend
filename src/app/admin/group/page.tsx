'use client';

import { useEffect, useState } from 'react';
import AdminGuard from '../components/AdminGuard';
import AdminLayout from '../components/layout/AdminLayout';
import axiosInstance from '@/libs/axios';
import GroupActions from './components/GroupActions';

interface GroupMember {
  id: string;
  email: string;
  nickname: string;
  role: string;
  joinedAt: string;
}

interface Group {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  memberCount: number;
  maxMembers: number;
  isActive: boolean;
  members: GroupMember[];
}

export default function AdminGroup() {
  const [groups, setGroups] = useState<Group[]>([]);
  const [filteredGroups, setFilteredGroups] = useState<Group[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set());
  const [selectedGroups, setSelectedGroups] = useState<string[]>([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    fetchGroups();
  }, []);

  useEffect(() => {
    // 검색어가 변경될 때마다 필터링
    if (searchKeyword.trim() === '') {
      setFilteredGroups(groups);
    } else {
      const filtered = groups.filter(
        (group) =>
          group.name.toLowerCase().includes(searchKeyword.toLowerCase()) ||
          group.description.toLowerCase().includes(searchKeyword.toLowerCase())
      );
      setFilteredGroups(filtered);
    }
  }, [searchKeyword, groups]);

  const fetchGroups = async () => {
    try {
      setIsLoading(true);
      console.log('그룹 목록 가져오기 시작...');

      const response = await axiosInstance.get('/api/admin/groups');
      console.log('API 응답:', response);
      console.log('응답 데이터:', response.data);

      if (!response.data || !Array.isArray(response.data)) {
        console.error('API 응답 데이터가 배열이 아닙니다:', response.data);
        setGroups([]);
        setFilteredGroups([]);
        return;
      }

      const fetchedGroups = response.data.map(
        (group: {
          groupId: number;
          groupName: string;
          createdDate: string;
          members: {
            userId: number;
            name: string;
            nickname: string;
            email: string;
          }[];
        }) => ({
          id: group.groupId.toString(),
          name: group.groupName,
          description: '설명 없음', // 백엔드에 description 필드가 없음
          createdAt: new Date(group.createdDate).toLocaleDateString('ko-KR'),
          memberCount: group.members?.length || 0,
          maxMembers: 10, // 백엔드에 maxMembers 필드가 없음
          isActive: true, // 백엔드에 isActive 필드가 없음
          members:
            group.members?.map((member) => ({
              id: member.userId.toString(),
              email: member.email,
              nickname: member.nickname || '닉네임 없음',
              role: '멤버', // 백엔드에 role 필드가 없음
              joinedAt: new Date().toLocaleDateString('ko-KR'), // 백엔드에 joinedAt 필드가 없음
            })) || [],
        })
      );

      console.log('처리된 그룹 데이터:', fetchedGroups);
      setGroups(fetchedGroups);
      setFilteredGroups(fetchedGroups);
    } catch (error: unknown) {
      console.error('그룹 목록 가져오기 실패:', error);

      let errorMessage = '알 수 없는 오류가 발생했습니다.';
      if (
        error &&
        typeof error === 'object' &&
        'response' in error &&
        error.response &&
        typeof error.response === 'object' &&
        'data' in error.response
      ) {
        const responseData = error.response.data as { message?: string };
        errorMessage =
          responseData?.message || 'API 호출 중 오류가 발생했습니다.';
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }

      console.error('에러 상세:', errorMessage);

      // 사용자에게 에러 메시지 표시
      alert(`그룹 목록을 가져오는데 실패했습니다: ${errorMessage}`);

      setGroups([]);
      setFilteredGroups([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (keyword: string) => {
    setSearchKeyword(keyword);
  };

  const handleDeleteGroups = async () => {
    try {
      // 선택된 그룹들 삭제
      for (const groupId of selectedGroups) {
        await axiosInstance.delete(`/api/admin/groups/${groupId}`);
      }

      // 성공적으로 삭제된 후 목록 새로고침
      await fetchGroups();
      setSelectedGroups([]);
      setShowDeleteModal(false);

      alert('선택된 그룹이 삭제되었습니다.');
    } catch (error) {
      console.error('그룹 삭제 실패:', error);
      alert('그룹 삭제 중 오류가 발생했습니다.');
    }
  };

  const handleSelectGroup = (groupId: string, checked: boolean) => {
    if (checked) {
      setSelectedGroups((prev) => [...prev, groupId]);
    } else {
      setSelectedGroups((prev) => prev.filter((id) => id !== groupId));
    }
  };

  const toggleGroupExpansion = (groupId: string) => {
    const newExpanded = new Set(expandedGroups);
    if (newExpanded.has(groupId)) {
      newExpanded.delete(groupId);
    } else {
      newExpanded.add(groupId);
    }
    setExpandedGroups(newExpanded);
  };

  return (
    <AdminGuard>
      <AdminLayout>
        <div className="h-full overflow-y-auto">
          {/* 페이지 헤더 */}
          <div className="mb-6 text-center">
            <h1 className="text-2xl font-semibold text-gray-900 mb-2">
              그룹 관리
            </h1>
            <p className="text-gray-600">
              전체 그룹 및 멤버 정보를 관리할 수 있습니다.
            </p>
          </div>

          {/* 검색 및 액션 바 */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              {/* 검색 입력 */}
              <div className="flex-1 max-w-md">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg
                      className="h-5 w-5 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                      />
                    </svg>
                  </div>
                  <input
                    type="text"
                    value={searchKeyword}
                    onChange={(e) => handleSearch(e.target.value)}
                    placeholder="그룹명 또는 설명으로 검색..."
                    className="block w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                  {searchKeyword && (
                    <button
                      onClick={() => handleSearch('')}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    >
                      <svg
                        className="h-5 w-5 text-gray-400 hover:text-gray-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2">
                {selectedGroups.length > 0 && (
                  <button
                    onClick={() => setShowDeleteModal(true)}
                    className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors text-sm"
                  >
                    선택 삭제 ({selectedGroups.length})
                  </button>
                )}
                <button
                  onClick={fetchGroups}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm"
                >
                  새로고침
                </button>
              </div>
            </div>
          </div>

          {/* 그룹 목록 */}
          <div className="space-y-4">
            {isLoading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-600">그룹 목록을 불러오는 중...</p>
              </div>
            ) : filteredGroups.length === 0 ? (
              <div className="text-center py-8">
                <div className="text-gray-400 text-6xl mb-4">🏢</div>
                <p className="text-gray-600">
                  {searchKeyword
                    ? '검색 결과가 없습니다.'
                    : '등록된 그룹이 없습니다.'}
                </p>
              </div>
            ) : (
              filteredGroups.map((group, index) => (
                <div
                  key={`group-${group.id || index}-${index}`}
                  className="bg-white rounded-lg shadow-sm border border-gray-200"
                >
                  {/* 그룹 헤더 */}
                  <div className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <input
                          type="checkbox"
                          checked={selectedGroups.includes(group.id)}
                          onChange={(e) =>
                            handleSelectGroup(group.id, e.target.checked)
                          }
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <div className="flex-1">
                          <div className="flex items-center space-x-3">
                            <h3 className="text-lg font-semibold text-gray-900">
                              {group.name}
                            </h3>
                            <span
                              className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                group.isActive
                                  ? 'bg-green-100 text-green-800'
                                  : 'bg-red-100 text-red-800'
                              }`}
                            >
                              {group.isActive ? '활성' : '비활성'}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 mt-1">
                            {group.description}
                          </p>
                          <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                            <span>
                              멤버: {group.memberCount}/{group.maxMembers}
                            </span>
                            <span>생성일: {group.createdAt}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2 relative">
                        <button
                          onClick={() => toggleGroupExpansion(group.id)}
                          className="text-gray-400 hover:text-gray-600 p-1"
                        >
                          <svg
                            className={`h-5 w-5 transform transition-transform ${
                              expandedGroups.has(group.id) ? 'rotate-180' : ''
                            }`}
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 9l-7 7-7-7"
                            />
                          </svg>
                        </button>
                        <GroupActions
                          group={group}
                          onDelete={() => {
                            setSelectedGroups([group.id]);
                            setShowDeleteModal(true);
                          }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* 그룹 멤버 목록 (확장 시 표시) */}
                  {expandedGroups.has(group.id) && (
                    <div className="border-t border-gray-200 bg-gray-50">
                      <div className="p-4">
                        <h4 className="text-sm font-medium text-gray-900 mb-3">
                          그룹 멤버 ({group.members.length}명)
                        </h4>
                        {group.members.length === 0 ? (
                          <p className="text-sm text-gray-500 text-center py-4">
                            멤버가 없습니다.
                          </p>
                        ) : (
                          <div className="grid grid-cols-1 gap-3">
                            {group.members.map((member, index) => (
                              <div
                                key={`${group.id || 'group'}-${member.id || 'member'}-${index}`}
                                className="bg-white p-3 rounded-lg border border-gray-200"
                              >
                                <div className="flex items-center justify-between">
                                  <div>
                                    <p className="text-sm font-medium text-gray-900">
                                      {member.nickname}
                                    </p>
                                    <p className="text-xs text-gray-500">
                                      {member.email}
                                    </p>
                                  </div>
                                  <div className="text-right">
                                    <span
                                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                        member.role === '리더'
                                          ? 'bg-blue-100 text-blue-800'
                                          : 'bg-gray-100 text-gray-800'
                                      }`}
                                    >
                                      {member.role}
                                    </span>
                                    <p className="text-xs text-gray-500 mt-1">
                                      {member.joinedAt}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ))
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
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mt-4">
                    그룹 삭제 확인
                  </h3>
                  <div className="mt-2 px-7 py-3">
                    <p className="text-sm text-gray-500">
                      선택된 {selectedGroups.length}개의 그룹을
                      삭제하시겠습니까?
                    </p>
                    <p className="text-sm text-red-500 mt-2">
                      이 작업은 되돌릴 수 없습니다.
                    </p>
                  </div>
                  <div className="items-center px-4 py-3">
                    <button
                      onClick={handleDeleteGroups}
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

          {/* 하단 여백 */}
          <div className="h-40"></div>
        </div>
      </AdminLayout>
    </AdminGuard>
  );
}
