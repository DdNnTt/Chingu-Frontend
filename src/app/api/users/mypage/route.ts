import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const API_BASE = process.env.API_BASE_URL;
  const token = req.headers.get('authorization');

  if (!API_BASE) {
    return NextResponse.json({ error: 'API_BASE_URL 누락됨' }, { status: 500 });
  }

  try {
    const res = await fetch(`${API_BASE}/api/users/mypage`, {
      method: 'GET',
      headers: {
        Authorization: token || '',
      },
    });

    const data = await res.json();
    return NextResponse.json(data);
  } catch (err) {
    console.error('[마이페이지 프록시 오류]', err);
    return NextResponse.json({ error: '서버 오류' }, { status: 500 });
  }
}
