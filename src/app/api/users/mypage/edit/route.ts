import { NextRequest, NextResponse } from 'next/server';

export async function PUT(req: NextRequest) {
  const token = req.headers.get('authorization');
  const API_BASE = process.env.API_BASE_URL;

  if (!API_BASE) {
    return NextResponse.json({ message: 'API 주소 누락' }, { status: 500 });
  }

  const body = await req.json();
  console.log('[프록시 전송 body]', body);

  try {
    const res = await fetch(`${API_BASE}/api/users/mypage/edit`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: token ?? '',
      },
      body: JSON.stringify(body),
    });

    const contentType = res.headers.get('content-type');
    const result = contentType?.includes('application/json')
      ? await res.json()
      : await res.text();

    return NextResponse.json({ data: result }, { status: res.status });
  } catch (error) {
    console.error('[마이페이지 수정 프록시 오류]', error);
    return NextResponse.json({ message: '서버 오류' }, { status: 500 });
  }
}
