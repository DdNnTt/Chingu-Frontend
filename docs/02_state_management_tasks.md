# 02_state_management.md 기반 작업 목록 (Task List)

## 작업 원칙 (이 문서 기준)

**전체 흐름**
1. **리팩토링 목록**을 먼저 작성한다 (순번·경로·설명 채우기).
2. 목록에서 **한 대상(한 행)**을 정한 뒤, 그 대상에 대해 **0.준비 → 1 → 2 → 3 → 4 → 5.Gate**를 순차적으로 진행한다.
3. 한 행의 5.Gate까지 끝나면 다음 행으로 넘어가서 다시 0부터 진행한다.

**진행 시**
- 한 번에 **하나의 sub-task**(체크 항목)만 처리한다.
- 사용자 승인(GO 등) 전에는 다음 sub-task로 넘어가지 않는다.
- 체크 후 다음으로 넘어갈지 사용자에게 확인한다.

## 적용 범위 (이번 PR 기준)
- [x] 02 상태 관리
- [ ] 01 컴포넌트 구조 및 의존성 (이번 PR 제외)
- [ ] 03 성능 최적화 (이번 PR 제외)
- [ ] 05 UX / 접근성 (이번 PR 제외)
- [ ] 06 테스트 (이번 PR 제외)

---

## 리팩토링 목록 (Refactoring List)

> **1단계:** 아래 표에 대상 컴포넌트(순번·경로·설명)를 먼저 채운다.  
> **2단계:** 한 행씩 선택해 0.준비부터 5.Gate까지 순차 진행하고, 단계별 체크를 표에 반영한다.

| 순번 | 경로 | 설명 | 0.준비 | 1.파생 | 2.Query | 3.UI | 4.SSoT | 5.Gate |
| :--: | ---- | ---- | :----: | :----: | :-----: | :--: | :----: | :----: |
| 1 | `src/app/front/my-home/group-list/page.tsx` | 내 그룹·초대 목록 (groups, invites / fetch+useEffect) | O | O | O | O | O | O |
| 2 | `src/app/front/my-home/page.tsx` | 마이홈 대시 (schedules, friends, groups, friendRequests, quizzes 등) | O | O | O | O | O | O |
| 3 | `src/app/front/my-home/group/detail/page.tsx` | 그룹 상세 (groupName, albums, schedules) |  |  |  |  |  |  |
| 4 | `src/app/front/my-home/group/album/albumList/page.tsx` | 앨범 목록 (albums / fetch+useEffect) |  |  |  |  |  |  |
| 5 | `src/app/front/my-home/group/album/detail/page.tsx` | 앨범 상세 (albumDetail / fetch+setState) |  |  |  |  |  |  |
| 6 | `src/app/front/my-home/friend-list/page.tsx` | 친구 목록 (friends / axios+setState) |  |  |  |  |  |  |
| 7 | `src/app/front/my-home/friend-requests/page.tsx` | 친구 요청 목록 (friendRequests) |  |  |  |  |  |  |
| 8 | `src/app/front/my-home/friend/[friendId]/page.tsx` | 친구 상세 (userData, friendsList, friendSince 등) |  |  |  |  |  |  |
| 9 | `src/app/front/my-home/member/list/page.tsx` | 그룹 멤버 목록 (members, friends) |  |  |  |  |  |  |
| 10 | `src/app/front/message/list/page.tsx` | 메시지 목록 (sent/received) |  |  |  |  |  |  |
| 11 | `src/app/front/message/detail/MessageDetail.tsx` | 메시지 상세 (message) |  |  |  |  |  |  |
| 12 | `src/app/front/game/guess-me/solve-quiz/page.tsx` | 퀴즈 풀기 (message 등) |  |  |  |  |  |  |
| 13 | `src/app/front/game/guess-me/make-quiz/page.tsx` | 퀴즈 만들기 (availableQuestions) |  |  |  |  |  |  |
| 14 | `src/app/front/my-page/page.tsx` | 마이페이지 (프로필 조회 fetch+setValue/setImagePreview 등) |  |  |  |  |  |  |
| 15 | `src/app/front/search/SearchUser.tsx` | 유저 검색 (users 검색 결과 / fetch+setUsers) |  |  |  |  |  |  |
| 16 | `src/app/admin/group/page.tsx` | 관리자 그룹 목록 (groups / axios) |  |  |  |  |  |  |
| 17 | `src/app/admin/member/page.tsx` | 관리자 회원 목록 (members, filteredMembers) |  |  |  |  |  |  |
| 18 | `src/app/admin/main/page.tsx` | 관리자 메인 대시 (stats / axios) |  |  |  |  |  |  |
| 19 | `src/components/common/ScheduleModal.tsx` | 일정 모달 (등록/수정 API + 로딩 상태) |  |  |  |  |  |  |
| 20 | `src/components/my-home/ScheduleEditModal.tsx` | 일정 수정 모달 (API + setState) |  |  |  |  |  |  |

---

## 0. 준비 (상태 진단)

**→ 현재 Primary (2번):** `src/app/front/my-home/page.tsx` (마이홈 대시)

- [x] 이번 PR의 Primary 대상(주 대상) 컴포넌트 1개 선택
- [x] Secondary(연관 컴포넌트) 목록 작성 (원칙: 수정 금지)  
  - `ScheduleModal`, `ScheduleEditModal` (모달 열기/닫기·일정 새로고침만 연동). `group-list`, `friend-list` 등 링크 페이지.
- [x] Primary 컴포넌트에서 상태/데이터 소스 전부 나열
  - [x] **useState:** `nickname`, `profilePictureUrl`, `userRole`, `schedules`, `friends`, `groups`, `friendRequests`, `receivedMessagesCount`, `quizzes`, `quizStats`, `isLoading`, `error`, `isScheduleModalOpen`, `isEditModalOpen`, `selectedSchedule`, `showAllSchedules`, `isQuizLoading`
  - [x] **Zustand:** 없음
  - [x] **React Query:** 없음
  - [x] **API + useEffect:** mount 시 `fetchData()` → fetchUserInfo, fetchSchedules, fetchFriends, fetchFriendRequests, fetchReceivedMessagesCount, fetchGroups, fetchMyQuizzes, fetchTotalFriendshipScore (axios/fetch + setState). 모달 닫을 때 fetchSchedules 재호출.
- [x] 각 항목을 아래 3가지 중 하나로 분류
  - **서버 상태:** `schedules`, `friends`, `groups`, `friendRequests`, `receivedMessagesCount`, `quizzes`, `quizStats`(totalFriendshipScore), `profilePictureUrl`, `userRole` → TanStack Query로 이전. `nickname`은 JWT에서만 읽음(선택: query 또는 유지).
  - **UI 상태:** `isScheduleModalOpen`, `isEditModalOpen`, `selectedSchedule`, `showAllSchedules`, `isLoading`, `isQuizLoading`(query로 대체 가능), `error`
  - **파생 상태:** `quizStats.totalQuizzes`(quizzes.length에서 계산) → 변수로. `recentSchedules`는 이미 변수(schedules 정렬·slice) → 유지

---

## 1. 파생 상태(derived state) 제거
> 원칙: “계산 가능하면 상태 아님”, “파생 값은 useState 금지”

- [x] 파생 상태 후보 식별 (1번: refreshKey / 2번: quizStats.totalQuizzes)
- [x] 파생 값을 useState로 저장하는 코드 제거 (2번: totalQuizzes 제거, 변수로 대체)
- [x] 대체 방식 적용 (totalQuizzes = quizzes.length, recentSchedules 등 변수 유지)
- [ ] 파생 상태 제거 후에도 화면 동작 동일한지 수동 확인

---

## 2. 서버 상태를 TanStack Query로 일원화
> 원칙: “서버 데이터는 useState로 복사 금지”, “fetch+useEffect 패턴 금지”

### 2-1) 서버 상태 식별
- [x] API로부터 가져오는 데이터 목록화 (1번: mygroups, invites)
- [x] 새로고침/캐싱 필요 데이터 식별

### 2-2) 금지 패턴 제거
- [x] 서버 데이터를 useState로 저장하는 코드 제거
- [x] fetch + useEffect로 서버 데이터 주입 패턴 제거

### 2-3) Query로 이전
- [x] useQuery로 서버 상태 이전 (queryKey: mygroups, invites / queryFn 분리)
  - [x] queryKey를 “의미 단위”로 정의
  - [ ] queryFn을 fetch 함수로 분리(가능하면)
- [x] useMutation: 초대 승인·거절, 그룹 탈퇴 → 성공 시 invalidate (staleTime 1분)

### 2-4) Query 설정 판단 기준 (staleTime 등)

각 query마다 **데이터 특성**을 보고 아래처럼 정한다. 구현 시 이 표를 참고해 선택한 뒤, 해당 컴포넌트/query에 적용한다.

| 데이터 특성 | 예시 | staleTime (참고) | 비고 |
|-------------|------|------------------|------|
| 자주 안 바뀜 | 그룹 목록, 친구 목록, 프로필 | 2~5분 (예: `2 * 60 * 1000`) | mutation 성공 시 invalidate |
| 가끔 바뀜 | 메시지 목록, 초대 목록, 앨범 목록 | 1분 (예: `60 * 1000`) | 새로고침/포커스 시 refetch 허용 |
| 비교적 실시간 | 알림 수, 읽음 수, 대시 통계 | 30초 이하 또는 0 | refetchInterval 고려 |
| 1회성/폼 결과 | 검색 결과, 상세 1건 조회 | 1~2분 또는 기본값 | 검색은 queryKey에 키워드 포함 |

- **판단 순서:** (1) 이 데이터가 다른 사용자/서버에 의해 얼마나 자주 바뀌는가? (2) 이 화면에서 "최신이 아니면 문제"인가? → yes면 짧게, no면 길게.
- **기본값:** 프로젝트 QueryClient 기본 `staleTime`을 1분으로 두고, 필요한 query만 오버라이드해도 됨.
- **invalidate:** 같은 리소스를 수정하는 mutation 성공 시 해당 queryKey `invalidateQueries` 호출은 공통 적용.

---

## 3. UI 상태(useState/Zustand) 정리
> 원칙: “Zustand는 UI 상태만”, “서버 데이터는 Zustand 금지”

### 3-1) useState로 유지할 UI 상태 확인
- [x] (1번) 로컬 useState 없음. 로딩/에러는 Query에서 제공 → 컴포넌트 내부·짧은 생명주기·비공유 만족

### 3-2) Zustand 사용 재점검
- [x] (1번) Zustand 미사용. 서버 데이터는 Query 캐시에만 존재

---

## 4. 상태 변경 단일 책임(SSoT) 점검
> 원칙: “같은 상태를 두 군데서 변경 금지”

- [x] (1번) 서버 상태 변경은 Query/Mutation·invalidate만 사용 → 단일 지점
- [x] setter 전달·여러 곳에서 setState 하는 흐름 없음

---

## 5. 최종 Gate 체크 (상태 관리 기준)
- [x] (1번) 파생 상태 useState 0건
- [x] (1번) 서버 상태를 useState로 복사 0건
- [x] (1번) 서버 데이터가 Zustand에 저장된 케이스 0건
- [x] (1번) fetch+useEffect로 서버 상태 주입 0건
- [x] (1번) 동일 상태 변경 지점 1곳 유지
- [ ] 리팩토링 전/후 화면 동작 동일(수동 확인)
- [ ] 변경 사항 요약 3줄 작성 (PR 설명용)  
  → 1번 예시: (1) group-list 서버 상태를 useQuery/useMutation으로 이전 (2) 파생 상태 refreshKey 제거 (3) QueryProvider·staleTime 1분 적용

**실패/롤백:** 리팩터링 후 동작 이상 시 해당 변경 revert 후 원인 정리. 필요 시 더 작은 단위로 나눠 다시 진행.

---

## PR 완료 조건 (Gate)
- 서버 상태 복사(useState/Zustand 저장) 0건
- 파생 상태(useState 저장) 0건
- 상태 변경 단일 책임 위반 0건
- 기능 동작 동일
