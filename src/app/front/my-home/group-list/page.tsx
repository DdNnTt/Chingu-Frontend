'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Button from '@/components/common/Button';
import Link from 'next/link';
import { getCookieValue } from '@/utils/cookie';

type Group = {
  groupId: number;
  groupName: string;
  description: string;
  createdAt: string;
};

type InviteGroup = {
  requestId: number;
  groupId: number;
  friendUserId: number;
  nickname: string;
  name: string;
  requestStatus: string;
  createdAt: string;
};

export default function GroupList() {
  const [groups, setGroups] = useState<Group[]>([]);
  const [invites, setInvites] = useState<InviteGroup[]>([]);
  const [visibleGroups, setVisibleGroups] = useState(3);
  const [visibleInvites, setVisibleInvites] = useState(3);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const token = getCookieValue('accessToken');

    if (!token) {
      alert('로그인이 필요합니다.');
      router.push('/front/account/login');
      return;
    }

    // 내 그룹 목록 조회
    fetch(`/api/groups/mygroups`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(async (res) => {
        if (!res.ok) throw new Error('그룹 목록 조회 실패');
        const data = await res.json();
        setGroups(data);
      })
      .catch((err) => {
        console.error('[그룹 목록 조회 오류]', err);
        setError('그룹 목록을 불러오지 못했습니다.');
      })
      .finally(() => setIsLoading(false));

    // 초대 목록 조회
    fetch('/api/groups/invites', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(async (res) => {
        if (!res.ok) throw new Error('초대 목록 조회 실패');
        const data = await res.json();
        setInvites(data);
      })
      .catch((err) => {
        console.error('[초대 목록 조회 오류]', err);
      });
  }, [router]);

  // 그룹 탈퇴
  const handleGroupDelete = async (groupId: number) => {
    const confirmDelete = confirm('정말로 이 그룹을 탈퇴하시겠습니까?');
    if (!confirmDelete) return;

    const token = getCookieValue('accessToken');
    console.log(
      '[그룹 삭제] 쿠키에서 가져온 토큰:',
      token ? `${token.substring(0, 30)}...` : 'null'
    );

    if (!token) {
      alert('인증 토큰이 없습니다.');
      return;
    }

    try {
      // 토큰에 Bearer가 이미 포함되어 있는지 확인
      const authHeader = token?.startsWith('Bearer ')
        ? token
        : `Bearer ${token}`;
      console.log(
        '[그룹 삭제] 최종 Authorization 헤더:',
        authHeader ? `${authHeader.substring(0, 30)}...` : 'null'
      );

      const res = await fetch(`/api/groups/${groupId}`, {
        method: 'DELETE',
        headers: {
          Authorization: authHeader,
        },
      });

      if (!res.ok) {
        const errorData = await res
          .json()
          .catch(() => ({ message: '그룹 삭제 실패' }));
        throw new Error(errorData.message || '그룹 삭제 실패');
      }

      alert('그룹이 성공적으로 삭제되었습니다.');
      // 그룹 목록에서 해당 그룹 제거
      setGroups((prev) => prev.filter((group) => group.groupId !== groupId));
    } catch (err) {
      console.error('[그룹 삭제 실패]', err);

      const errorMessage =
        err instanceof Error
          ? err.message
          : '그룹 삭제 중 오류가 발생했습니다.';

      // 외래키 제약조건 오류 처리
      if (
        errorMessage.includes('foreign key constraint') ||
        errorMessage.includes('Cannot delete')
      ) {
        alert(
          '그룹에 연결된 데이터가 있어 삭제할 수 없습니다.\n\n가능한 원인:\n• 그룹 스케줄\n• 그룹 앨범\n• 그룹 멤버 정보\n\n백엔드 관리자에게 문의하거나 잠시 후 다시 시도해주세요.'
        );
      } else {
        alert(errorMessage);
      }
    }
  };

  return (
    <div className="group-list-page py-24 px-4 mx-auto rounded-lg bg-gray-100">
      <div className="flex items-center mb-6">
        <button
          onClick={() => router.back()}
          className="text-gray-600 hover:text-gray-800"
          aria-label="뒤로가기"
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
          내 그룹 목록
        </h2>
      </div>

      <div className="flex justify-end mb-4">
        <Link
          href="/front/my-home/group/add"
          className="text-sm px-3 py-1 bg-[#9477ff] hover:bg-[#6845f5] text-white rounded"
        >
          그룹 생성
        </Link>
      </div>

      {/* 그룹 목록 */}
      <div
        className="group-list bg-white rounded-lg shadow-sm p-4 pr-1 space-y-3 max-h-[calc(90px*3)] overflow-y-auto scroll-overlay"
        style={{ scrollbarGutter: 'stable' }}
      >
        {isLoading ? (
          <div className="text-center text-gray-400 text-sm">
            불러오는 중...
          </div>
        ) : error ? (
          <div className="text-red-500">{error}</div>
        ) : groups.length === 0 ? (
          <div className="text-center text-gray-400 text-sm">
            그룹 목록이 없습니다. 그룹을 생성해주세요!
          </div>
        ) : (
          groups.slice(0, visibleGroups).map((group) => (
            <div
              key={group.groupId}
              className="group-item flex items-center justify-between bg-white py-2 px-3 rounded-md shadow-sm cursor-pointer hover:bg-gray-50"
              onClick={() =>
                router.push(
                  `/front/my-home/group/detail?groupId=${group.groupId}`
                )
              }
            >
              <div>
                <div className="font-semibold text-gray-800">
                  {group.groupName}
                </div>
                <div className="text-sm text-gray-500">{group.description}</div>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation(); // 버튼 클릭 시 부모 div의 클릭 이벤트 방지
                  handleGroupDelete(group.groupId);
                }}
                className="text-sm px-2 py-1 bg-point2-color text-white rounded hover:bg-red-400"
              >
                그룹 탈퇴
              </button>
            </div>
          ))
        )}

        {visibleGroups < groups.length && (
          <div className="text-center mt-2">
            <Button
              type="button"
              onClick={() => setVisibleGroups((prev) => prev + 3)}
              className="flex-1 w-full bg-blue-600 text-white mt-4"
            >
              더보기
            </Button>
          </div>
        )}
      </div>

      {/* 초대 목록 */}
      <div className="group-vite-list bg-white rounded-lg shadow-sm p-4 mt-10 space-y-3 max-h-[calc(90px*3)] overflow-y-auto scroll-overlay">
        {isLoading ? (
          <p className="text-center text-gray-400 text-sm">불러오는 중...</p>
        ) : invites.length === 0 ? (
          <p className="text-center text-gray-400 text-sm">
            초대된 그룹이 없습니다.
          </p>
        ) : (
          invites.slice(0, visibleInvites).map((invite) => (
            <div
              key={invite.requestId}
              className="flex items-center justify-between bg-white p-3 rounded-md shadow-sm"
            >
              <div className="font-medium text-gray-800">
                {invite.nickname}님의 그룹
              </div>
              <div className="space-x-2">
                <button className="text-xs px-2 py-1 bg-gray-300 rounded hover:bg-gray-400">
                  거절
                </button>
                <button className="text-xs px-2 py-1 bg-green-500 text-white rounded hover:bg-green-600">
                  승인
                </button>
              </div>
            </div>
          ))
        )}

        {visibleInvites < invites.length && (
          <div className="text-center mt-2">
            <Button
              type="button"
              onClick={() => setVisibleInvites((prev) => prev + 3)}
              className="text-sm text-blue-600"
            >
              더보기
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
