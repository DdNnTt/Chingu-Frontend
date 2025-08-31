import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const API_BASE = process.env.API_BASE_URL;
  const token = req.headers.get('authorization');

  if (!API_BASE) {
    return NextResponse.json({ error: 'API_BASE_URL 누락됨' }, { status: 500 });
  }

  if (!token) {
    return NextResponse.json(
      { error: '인증 토큰이 필요합니다' },
      { status: 401 }
    );
  }

  try {
    const res = await fetch(new URL('/api/admin/check', API_BASE).toString(), {
      method: 'GET',
      headers: {
        Authorization: token,
      },
      cache: 'no-store',
      signal: AbortSignal.timeout(10000),
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.error('[관리자 권한 확인 실패]', res.status, errorText);
      return NextResponse.json(
        { error: '관리자 권한 확인 실패', status: res.status },
        { status: res.status }
      );
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (err) {
    console.error('[관리자 권한 확인 프록시 오류]', err);
    return NextResponse.json({ error: '서버 오류' }, { status: 500 });
  }
}
