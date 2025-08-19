import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const API_BASE = process.env.API_BASE_URL;
  const token = req.headers.get('authorization');

  if (!API_BASE) {
    return NextResponse.json({ error: 'API_BASE_URL 누락됨' }, { status: 500 });
  }

  try {
    const body = await req.json();
    
    const res = await fetch(`${API_BASE}/api/quizzes/solve`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: token || '',
      },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.error('[퀴즈 풀이 응답 실패]', res.status, errorText);
      return NextResponse.json(
        { error: '퀴즈 풀이 실패', status: res.status },
        { status: res.status }
      );
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (err) {
    console.error('[퀴즈 풀이 프록시 오류]', err);
    return NextResponse.json({ error: '서버 오류' }, { status: 500 });
  }
}
