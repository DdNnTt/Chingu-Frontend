import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const API_BASE = process.env.API_BASE_URL;

  if (!API_BASE) {
    console.error('[환경변수 오류] API_BASE_URL이 설정되지 않았습니다.');
    return NextResponse.json(
      { message: 'API 주소가 설정되지 않았습니다.' },
      { status: 500 }
    );
  }

  try {
    const body = await req.json();

    const backendRes = await fetch(`${API_BASE}/api/users/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    const contentType = backendRes.headers.get('content-type');
    const data = contentType?.includes('application/json')
      ? await backendRes.json()
      : await backendRes.text();

    return new NextResponse(
      contentType?.includes('application/json') ? JSON.stringify(data) : data,
      {
        status: backendRes.status,
        headers: { 'Content-Type': contentType ?? 'text/plain' },
      }
    );
  } catch (err) {
    console.error('[프록시 오류]', err);
    return NextResponse.json(
      { message: '서버 프록시 오류 발생' },
      { status: 500 }
    );
  }
}
