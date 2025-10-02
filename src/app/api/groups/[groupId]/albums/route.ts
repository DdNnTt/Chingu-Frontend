import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

const dailyUploadCounts = new Map<string, number>();
const dailyUploadLocks = new Map<string, Promise<number>>();

console.warn(
  '⚠️ 메모리 기반 카운트 관리 사용 중 - 서버 재시작 시 데이터 손실됨'
);

// 이전 날짜 키 정리 함수
function cleanupOldKeys() {
  const today = new Date().toISOString().split('T')[0];
  const keysToDelete: string[] = [];

  for (const key of dailyUploadCounts.keys()) {
    const keyDate = key.split('_').pop();
    if (keyDate && keyDate < today) {
      keysToDelete.push(key);
    }
  }

  keysToDelete.forEach((key) => {
    dailyUploadCounts.delete(key);
    dailyUploadLocks.delete(key);
  });

  if (keysToDelete.length > 0) {
    console.log(`[메모리 정리] ${keysToDelete.length}개의 이전 날짜 키 삭제됨`);
  }
}

// checkDailyUploadCount 함수는 더 이상 사용하지 않음 (원자적 연산으로 대체)

async function incrementDailyUploadCount(
  groupId: string,
  date: string
): Promise<number> {
  const key = `daily_album_upload_${groupId}_${date}`;

  // 이전 날짜 키 정리
  cleanupOldKeys();

  // 동시성 문제 해결: 락 사용
  if (dailyUploadLocks.has(key)) {
    await dailyUploadLocks.get(key);
  }

  const lockPromise = (async () => {
    const currentCount = dailyUploadCounts.get(key) || 0;
    const newCount = currentCount + 1;
    dailyUploadCounts.set(key, newCount);
    return newCount;
  })();

  dailyUploadLocks.set(key, lockPromise);
  const newCount = await lockPromise;

  // 락 해제
  dailyUploadLocks.delete(key);

  return newCount;
}

export async function GET(req: NextRequest) {
  const token = req.headers.get('authorization');
  const API_BASE = process.env.API_BASE_URL;

  if (!API_BASE) {
    return NextResponse.json({ message: 'API 주소 누락' }, { status: 500 });
  }

  const pathname = req.nextUrl.pathname;
  const match = pathname.match(/\/api\/groups\/([^/]+)\/albums/);
  const groupId = match?.[1];

  if (!groupId) {
    return NextResponse.json({ message: 'groupId 누락' }, { status: 400 });
  }

  try {
    const res = await fetch(`${API_BASE}/api/groups/${groupId}/albums`, {
      method: 'GET',
      headers: {
        Authorization: token ?? '',
      },
    });

    const text = await res.text();

    try {
      const data = JSON.parse(text);
      return NextResponse.json(data, { status: res.status });
    } catch {
      return NextResponse.json({ message: text }, { status: res.status });
    }
  } catch (err) {
    console.error('[프록시 GET 오류]', err);
    return NextResponse.json({ message: '서버 오류' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const token = req.headers.get('authorization');
  const API_BASE = process.env.API_BASE_URL;

  if (!API_BASE) {
    return NextResponse.json({ message: 'API 주소 누락' }, { status: 500 });
  }

  const pathname = req.nextUrl.pathname;
  const match = pathname.match(/\/api\/groups\/([^/]+)\/albums/);
  const groupId = match?.[1];

  if (!groupId) {
    return NextResponse.json({ message: 'groupId 누락' }, { status: 400 });
  }

  const today = new Date().toISOString().split('T')[0];

  // 원자적 연산: 증가 후 결과 확인 (TOCTOU 취약점 해결)
  const newCount = await incrementDailyUploadCount(groupId, today);

  if (newCount > 1) {
    // 제한 초과 시 롤백
    const key = `daily_album_upload_${groupId}_${today}`;
    const currentCount = dailyUploadCounts.get(key) || 0;
    dailyUploadCounts.set(key, Math.max(0, currentCount - 1));

    return NextResponse.json(
      {
        message: '하루에 1개의 앨범만 업로드할 수 있습니다.',
        error: 'DAILY_UPLOAD_LIMIT_EXCEEDED',
      },
      { status: 429 }
    );
  }

  try {
    const body = await req.json();

    console.log('[앨범 생성 프록시] 요청 데이터:', {
      groupId,
      body,
      token: token ? `${token.substring(0, 20)}...` : 'null',
      tokenFormat: token
        ? token.startsWith('Bearer ')
          ? 'Bearer 포함됨'
          : 'Bearer 없음'
        : 'null',
      API_BASE,
    });

    const res = await fetch(`${API_BASE}/api/groups/${groupId}/albums`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: token ?? '',
      },
      body: JSON.stringify(body),
    });

    console.log('[앨범 생성 프록시] 백엔드 응답:', {
      status: res.status,
      statusText: res.statusText,
      headers: Object.fromEntries(res.headers.entries()),
    });

    const text = await res.text();
    console.log('[앨범 생성 프록시] 백엔드 응답 텍스트:', text);
    console.log('[앨범 생성 프록시] 백엔드 응답 상세:', {
      url: `${API_BASE}/api/groups/${groupId}/albums`,
      requestBody: body,
      responseStatus: res.status,
      responseText: text,
    });

    try {
      const data = JSON.parse(text);
      console.log('[앨범 생성 프록시] 파싱된 응답 데이터:', data);

      // 앨범 생성 성공 시 카운트는 이미 증가됨 (원자적 연산으로 처리됨)
      if (res.status === 200 || res.status === 201) {
        console.log(
          `[앨범 생성 성공] 그룹 ${groupId}의 일일 업로드 카운트: ${newCount}`
        );
      } else {
        // 앨범 생성 실패 시 롤백
        const key = `daily_album_upload_${groupId}_${today}`;
        const currentCount = dailyUploadCounts.get(key) || 0;
        dailyUploadCounts.set(key, Math.max(0, currentCount - 1));
        console.log(
          `[앨범 생성 실패] 그룹 ${groupId}의 일일 업로드 카운트 롤백`
        );
      }

      return NextResponse.json(data, { status: res.status });
    } catch (parseError) {
      console.error('[앨범 생성 프록시] JSON 파싱 실패:', parseError);
      return NextResponse.json(
        { message: text, error: 'JSON 파싱 실패' },
        { status: res.status }
      );
    }
  } catch (err) {
    console.error('[프록시 POST 오류]', err);
    return NextResponse.json(
      {
        message: '서버 오류',
        error: err instanceof Error ? err.message : String(err),
      },
      { status: 500 }
    );
  }
}
