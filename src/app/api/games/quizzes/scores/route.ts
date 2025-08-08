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
    const res = await fetch(`${API_BASE}/api/games/quizzes/scores`, {
      method: 'GET',
      headers: {
        Authorization: token,
      },
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.error('[우정 점수 조회 응답 실패]', res.status, errorText);
      return NextResponse.json(
        { error: '우정 점수 조회 실패', details: errorText },
        { status: res.status }
      );
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (err) {
    console.error('[우정 점수 조회 프록시 오류]', err);
    return NextResponse.json({ error: '서버 오류' }, { status: 500 });
  }
}
