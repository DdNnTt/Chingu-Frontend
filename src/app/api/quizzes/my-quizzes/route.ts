import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const API_BASE = process.env.API_BASE_URL;
  const token = req.headers.get('authorization');

  if (!API_BASE) {
    return NextResponse.json({ error: 'API_BASE_URL 누락됨' }, { status: 500 });
  }

  try {
    const res = await fetch(`${API_BASE}/api/quizzes/my-quizzes`, {
      method: 'GET',
      headers: {
        Authorization: token || '',
      },
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.error('[내 퀴즈 조회 응답 실패]', res.status, errorText);
      return NextResponse.json(
        { error: '내 퀴즈 조회 실패', status: res.status },
        { status: res.status }
      );
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (err) {
    console.error('[내 퀴즈 조회 프록시 오류]', err);
    return NextResponse.json({ error: '서버 오류' }, { status: 500 });
  }
}
