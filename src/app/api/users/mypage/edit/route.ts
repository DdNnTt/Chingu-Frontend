import { NextRequest, NextResponse } from 'next/server';

export async function PATCH(req: NextRequest) {
  const token = req.headers.get('authorization');
  const API_BASE = process.env.API_BASE_URL;

  if (!API_BASE) {
    return NextResponse.json({ message: 'API 주소 누락' }, { status: 500 });
  }

  const body = await req.json();
  console.log('[프록시 PATCH 요청]', body);

  try {
    const res = await fetch(`${API_BASE}/api/users/mypage/edit`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: token ?? '',
      },
      body: JSON.stringify(body),
    });

    const text = await res.text();
    try {
      const data = JSON.parse(text);
      return NextResponse.json(data, { status: res.status });
    } catch {
      return NextResponse.json({ message: text }, { status: res.status });
    }
  } catch (err) {
    console.error('[프록시 PATCH 오류]', err);
    return NextResponse.json({ message: '서버 오류' }, { status: 500 });
  }
}
