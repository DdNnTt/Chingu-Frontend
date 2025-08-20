import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const API_BASE = process.env.API_BASE_URL;

  try {
    const body = await req.json();
    console.log('[받은 요청 body]', body);

    const backendRes = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    const contentType = backendRes.headers.get('content-type');
    const rawText = await backendRes.text();

    console.log('[백엔드 응답 상태]', backendRes.status);
    console.log('[백엔드 응답 본문]', rawText);
    console.log('[백엔드 응답 타입]', contentType);

    if (!backendRes.ok) {
      return new NextResponse(rawText, {
        status: backendRes.status,
        headers: {
          'Content-Type': contentType ?? 'text/plain',
        },
      });
    }

    return new NextResponse(rawText, {
      status: backendRes.status,
      headers: {
        'Content-Type': contentType ?? 'text/plain',
      },
    });
  } catch (error) {
    console.error('[프록시 로그인 오류]', error);
    return NextResponse.json(
      { message: '로그인 중 오류 발생' },
      { status: 500 }
    );
  }
}
