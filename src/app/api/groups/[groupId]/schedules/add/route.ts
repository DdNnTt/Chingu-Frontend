import { NextRequest, NextResponse } from 'next/server';

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ groupId: string }> }
) {
  const token = req.headers.get('authorization');
  if (!token) {
    return NextResponse.json({ message: '권한 없음' }, { status: 401 });
  }

  const API_BASE = process.env.API_BASE_URL;
  if (!API_BASE) {
    return NextResponse.json({ message: 'API 주소 누락' }, { status: 500 });
  }

  try {
    const body = await req.json();
    const { groupId } = await params;

    // 백엔드로 전송되는 데이터 로깅
    console.log('[API 프록시] 백엔드로 전송되는 데이터:', body);
    console.log('[API 프록시] scheduleDate:', body.scheduleDate);

    const res = await fetch(`${API_BASE}/api/groups/${groupId}/schedules`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: token,
      },
      body: JSON.stringify(body),
    });

    console.log('[API 프록시] 백엔드 응답 상태:', res.status);
    console.log(
      '[API 프록시] 백엔드 응답 헤더:',
      Object.fromEntries(res.headers.entries())
    );

    const data = await res.json();

    // 백엔드 응답 데이터 로깅
    console.log('[API 프록시] 백엔드 응답 데이터:', data);
    if (data.scheduleDate) {
      console.log('[API 프록시] 백엔드 응답 scheduleDate:', data.scheduleDate);
    }

    if (!res.ok) {
      console.error('[API 프록시] 백엔드 에러:', data);
    }

    return NextResponse.json(data, { status: res.status });
  } catch (err) {
    console.error('[API 프록시 오류] 그룹 일정 추가 실패:', err);
    return NextResponse.json(
      { message: '서버 오류로 그룹 일정 추가에 실패했습니다.' },
      { status: 500 }
    );
  }
}
