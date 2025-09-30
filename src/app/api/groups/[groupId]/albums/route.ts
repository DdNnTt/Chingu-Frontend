import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

const dailyUploadCounts = new Map<string, number>();

console.warn(
  '⚠️ 메모리 기반 카운트 관리 사용 중 - 서버 재시작 시 데이터 손실됨'
);

async function checkDailyUploadCount(
  groupId: string,
  date: string
): Promise<number> {
  const key = `daily_album_upload_${groupId}_${date}`;
  return dailyUploadCounts.get(key) || 0;
}

async function incrementDailyUploadCount(
  groupId: string,
  date: string
): Promise<void> {
  const key = `daily_album_upload_${groupId}_${date}`;
  const currentCount = dailyUploadCounts.get(key) || 0;
  dailyUploadCounts.set(key, currentCount + 1);
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

  const dailyUploadCount = await checkDailyUploadCount(groupId, today);

  if (dailyUploadCount >= 1) {
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

      // 앨범 생성 성공 시 일일 업로드 카운트 증가
      if (res.status === 200 || res.status === 201) {
        await incrementDailyUploadCount(groupId, today);
        console.log(
          `[앨범 생성 성공] 그룹 ${groupId}의 일일 업로드 카운트 증가`
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
