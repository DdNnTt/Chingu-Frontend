'use client';

import { useEffect, useState } from 'react';
import AdminGuard from '../components/AdminGuard';
import AdminLayout from '../components/layout/AdminLayout';
import Link from 'next/link';
import axiosInstance from '@/libs/axios';

interface StatsData {
  totalUsers: number;
  totalGroups: number;
  activeUsers: number;
}

export default function AdminMain() {
  const [stats, setStats] = useState<StatsData>({
    totalUsers: 0,
    totalGroups: 0,
    activeUsers: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setIsLoading(true);

        // 전체 회원 수 가져오기
        const usersResponse = await axiosInstance.get('/api/admin/users');
        const totalUsers = usersResponse.data?.length || 0;

        // 전체 그룹 수 가져오기
        const groupsResponse = await axiosInstance.get('/api/admin/groups');
        const totalGroups = groupsResponse.data?.length || 0;

        // 활성 사용자 수 (최근 30일 로그인한 사용자로 가정)
        const activeUsers = totalUsers; // 임시로 전체 사용자 수로 설정

        setStats({
          totalUsers,
          totalGroups,
          activeUsers,
        });
      } catch (error) {
        console.error('통계 데이터 가져오기 실패:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, []);

  return (
    <AdminGuard>
      <AdminLayout>
        <div className="h-full overflow-y-auto">
          {/* 페이지 헤더 */}
          <div className="mb-4">
            <h1 className="text-2xl font-semibold mb-6 text-center">
              관리자 대시보드
            </h1>
            <p className="text-s text-gray-600 text-center">
              시스템 전체 현황을 한눈에 확인하세요
            </p>
          </div>

          {/* 통계 카드들 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-4">
            <div className="bg-white p-2 rounded-xl shadow-sm border border-gray-100">
              <div className="flex items-center justify-center">
                <div className="p-1.5 bg-blue-50 rounded-lg">
                  <span className="text-base">👥</span>
                </div>
                <div className="ml-2 min-w-0 flex-1">
                  <p className="text-sm font-medium text-gray-600">전체 회원</p>
                  {isLoading ? (
                    <div className="animate-pulse bg-gray-200 h-7 w-16 rounded-lg"></div>
                  ) : (
                    <p className="text-2xl font-bold text-gray-900">
                      {stats.totalUsers.toLocaleString()}
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div className="bg-white p-2 rounded-xl shadow-sm border border-gray-100">
              <div className="flex items-center justify-center">
                <div className="p-1.5 bg-green-50 rounded-lg">
                  <span className="text-base">🏢</span>
                </div>
                <div className="ml-2 min-w-0 flex-1">
                  <p className="text-sm font-medium text-gray-600">전체 그룹</p>
                  {isLoading ? (
                    <div className="animate-pulse bg-gray-200 h-7 w-16 rounded-lg"></div>
                  ) : (
                    <p className="text-2xl font-bold text-gray-900">
                      {stats.totalGroups.toLocaleString()}
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div className="bg-white p-2 rounded-xl shadow-sm border border-gray-100 sm:col-span-2 lg:col-span-1">
              <div className="flex items-center justify-center">
                <div className="p-1.5 bg-purple-50 rounded-lg">
                  <span className="text-base">📊</span>
                </div>
                <div className="ml-2 min-w-0 flex-1">
                  <p className="text-sm font-medium text-gray-600">
                    활성 사용자
                  </p>
                  {isLoading ? (
                    <div className="animate-pulse bg-gray-200 h-7 w-16 rounded-lg"></div>
                  ) : (
                    <p className="text-2xl font-bold text-gray-900">
                      {stats.activeUsers.toLocaleString()}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* 관리 섹션 카드들 */}
          <div className="grid grid-cols-1 gap-3">
            <Link href="/admin/member">
              <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200 cursor-pointer group">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      회원 관리
                    </h3>
                    <p className="text-sm text-gray-600 mb-3">
                      전체 회원 목록 조회, 검색, 삭제
                    </p>
                    <div className="flex items-center text-blue-600 group-hover:text-blue-700 transition-colors">
                      <span className="text-sm font-medium">바로가기</span>
                      <svg
                        className="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </div>
                  </div>
                  <span className="text-4xl ml-6 text-blue-100 group-hover:text-blue-200 transition-colors">
                    👥
                  </span>
                </div>
              </div>
            </Link>

            <Link href="/admin/group">
              <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200 cursor-pointer group">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      그룹 관리
                    </h3>
                    <p className="text-sm text-gray-600 mb-3">
                      전체 그룹 및 멤버 정보 관리
                    </p>
                    <div className="flex items-center text-blue-600 group-hover:text-blue-700 transition-colors">
                      <span className="text-sm font-medium">바로가기</span>
                      <svg
                        className="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </div>
                  </div>
                  <span className="text-4xl ml-6 text-blue-100 group-hover:text-blue-200 transition-colors">
                    🏢
                  </span>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </AdminLayout>
    </AdminGuard>
  );
}
