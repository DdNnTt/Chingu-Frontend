'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
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

const queryKeys = {
  myGroups: ['groups', 'mygroups'] as const,
  invites: ['groups', 'invites'] as const,
};

const STALE_TIME = 60 * 1000; // 1분 (가끔 바뀜)

async function fetchMyGroups(): Promise<Group[]> {
  const token = getCookieValue('accessToken');
  if (!token) throw new Error('로그인이 필요합니다.');
  const res = await fetch('/api/groups/mygroups', {
    method: 'GET',
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error('그룹 목록 조회 실패');
  return res.json();
}

async function fetchInvites(): Promise<InviteGroup[]> {
  const token = getCookieValue('accessToken');
  if (!token) throw new Error('로그인이 필요합니다.');
  const res = await fetch('/api/groups/invites', {
    method: 'GET',
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error('초대 목록 조회 실패');
  return res.json();
}

export default function GroupList() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const token = getCookieValue('accessToken');

  useEffect(() => {
    if (!token) {
      alert('로그인이 필요합니다.');
      router.push('/front/account/login');
    }
  }, [token, router]);

  const groupsQuery = useQuery({
    queryKey: queryKeys.myGroups,
    queryFn: fetchMyGroups,
    enabled: !!token,
    staleTime: STALE_TIME,
  });

  const invitesQuery = useQuery({
    queryKey: queryKeys.invites,
    queryFn: fetchInvites,
    enabled: !!token,
    staleTime: STALE_TIME,
  });

  const inviteRespondMutation = useMutation({
    mutationFn: async ({
      requestId,
      status,
    }: {
      requestId: number;
      status: 'ACCEPTED' | 'REJECTED';
    }) => {
      const t = getCookieValue('accessToken');
      if (!t) throw new Error('인증 토큰이 없습니다.');
      const res = await fetch('/api/groups/invites/respond', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${t}`,
        },
        body: JSON.stringify({ requestId, status }),
      });
      if (!res.ok) {
        const errorData = await res
          .json()
          .catch(() => ({ message: '초대 응답 실패' }));
        if (
          errorData.message &&
          errorData.message.includes('이미 그룹에 가입된 사용자')
        ) {
          return { alreadyMember: true as const };
        }
        throw new Error(errorData.message || '초대 응답 실패');
      }
      return res.json();
    },
    onSuccess: (_, variables) => {
      if (variables.status === 'ACCEPTED') {
        queryClient.invalidateQueries({ queryKey: queryKeys.myGroups });
      }
      queryClient.invalidateQueries({ queryKey: queryKeys.invites });
    },
  });

  const leaveGroupMutation = useMutation({
    mutationFn: async (groupId: number) => {
      const t = getCookieValue('accessToken');
      if (!t) throw new Error('인증 토큰이 없습니다.');
      const authHeader = t.startsWith('Bearer ') ? t : `Bearer ${t}`;
      const res = await fetch(`/api/groups/${groupId}`, {
        method: 'DELETE',
        headers: { Authorization: authHeader },
      });
      if (!res.ok) {
        const errorData = await res
          .json()
          .catch(() => ({ message: '그룹 삭제 실패' }));
        throw new Error(errorData.message || '그룹 삭제 실패');
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.myGroups });
    },
  });

  const handleInviteAccept = (requestId: number) => {
    inviteRespondMutation.mutate(
      { requestId, status: 'ACCEPTED' },
      {
        onSuccess: (data) => {
          if (data && typeof data === 'object' && 'alreadyMember' in data) {
            alert(
              '이미 해당 그룹에 가입되어 있습니다. 초대 목록에서 제거되었습니다.'
            );
            return;
          }
          alert('그룹 초대를 승인했습니다.');
        },
        onError: (err) => {
          alert(
            err instanceof Error ? err.message : '초대 승인 중 오류가 발생했습니다.'
          );
        },
      }
    );
  };

  const handleInviteReject = (requestId: number) => {
    inviteRespondMutation.mutate(
      { requestId, status: 'REJECTED' },
      {
        onSuccess: () => alert('그룹 초대를 거절했습니다.'),
        onError: (err) => {
          alert(
            err instanceof Error ? err.message : '초대 거절 중 오류가 발생했습니다.'
          );
        },
      }
    );
  };

  const handleGroupDelete = (groupId: number) => {
    if (!confirm('정말로 이 그룹을 탈퇴하시겠습니까?')) return;
    leaveGroupMutation.mutate(groupId, {
      onSuccess: () => alert('그룹이 성공적으로 삭제되었습니다.'),
      onError: (err) => {
        const message =
          err instanceof Error ? err.message : '그룹 삭제 중 오류가 발생했습니다.';
        if (
          message.includes('foreign key constraint') ||
          message.includes('Cannot delete')
        ) {
          alert(
            '그룹에 연결된 데이터가 있어 삭제할 수 없습니다.\n\n가능한 원인:\n• 그룹 스케줄\n• 그룹 앨범\n• 그룹 멤버 정보\n\n백엔드 관리자에게 문의하거나 잠시 후 다시 시도해주세요.'
          );
        } else {
          alert(message);
        }
      },
    });
  };

  if (!token) {
    return null;
  }

  const groups = groupsQuery.data ?? [];
  const invites = invitesQuery.data ?? [];
  const pendingInvites = invites.filter(
    (invite) => invite.requestStatus !== 'ACCEPTED'
  );
  const isLoading = groupsQuery.isPending || invitesQuery.isPending;
  const errorMessage =
    groupsQuery.error || invitesQuery.error
      ? (groupsQuery.error instanceof Error
          ? groupsQuery.error.message
          : invitesQuery.error instanceof Error
            ? invitesQuery.error.message
            : '오류가 발생했습니다.')
      : null;

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
        ) : errorMessage ? (
          <div className="text-red-500">{errorMessage}</div>
        ) : groups.length === 0 ? (
          <div className="text-center text-gray-400 text-sm">
            그룹 목록이 없습니다. 그룹을 생성해주세요!
          </div>
        ) : (
          groups.map((group) => (
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
                  e.stopPropagation();
                  handleGroupDelete(group.groupId);
                }}
                className="text-sm px-2 py-1 bg-point2-color text-white rounded hover:bg-red-400"
              >
                그룹 탈퇴
              </button>
            </div>
          ))
        )}
      </div>

      {/* 초대 목록 */}
      <div className="group-vite-list bg-white rounded-lg shadow-sm p-4 mt-10 space-y-3 max-h-[calc(90px*3)] overflow-y-auto scroll-overlay">
        {isLoading ? (
          <p className="text-center text-gray-400 text-sm">불러오는 중...</p>
        ) : pendingInvites.length === 0 ? (
          <p className="text-center text-gray-400 text-sm">
            초대된 그룹이 없습니다.
          </p>
        ) : (
          pendingInvites.map((invite) => (
            <div
              key={invite.requestId}
              className="flex items-center justify-between bg-white p-3 rounded-md shadow-sm"
            >
              <div className="font-medium text-gray-800">
                {invite.nickname}님의 그룹
              </div>
              <div className="space-x-2">
                <button
                  onClick={() => handleInviteReject(invite.requestId)}
                  className="text-xs px-2 py-1 bg-gray-300 rounded hover:bg-gray-400"
                >
                  거절
                </button>
                <button
                  onClick={() => handleInviteAccept(invite.requestId)}
                  className="text-xs px-2 py-1 bg-main-color text-white rounded"
                >
                  승인
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
