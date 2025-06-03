import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
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

    const backendRes = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    const contentType = backendRes.headers.get('content-type');

    if (!backendRes.ok) {
      const errorBody = await backendRes.text();
      console.error('[백엔드 로그인 에러]', backendRes.status, errorBody);
      return new NextResponse(errorBody, {
        status: backendRes.status,
        headers: {
          'Content-Type': contentType ?? 'text/plain',
        },
      });
    }

    const data = contentType?.includes('application/json')
      ? await backendRes.json()
      : await backendRes.text();

    return new NextResponse(
      contentType?.includes('application/json') ? JSON.stringify(data) : data,
      {
        status: backendRes.status,
        headers: {
          'Content-Type': contentType ?? 'text/plain',
        },
      }
    );
  } catch (err) {
    console.error('[프록시 로그인 오류]', err);
    return NextResponse.json(
      { message: '서버 프록시 오류 발생' },
      { status: 500 }
    );
  }
}
