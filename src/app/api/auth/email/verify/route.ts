import { NextRequest, NextResponse } from 'next/server';

const API_BASE = process.env.API_BASE_URL;

export async function POST(req: NextRequest) {
  const email = req.nextUrl.searchParams.get('email');
  if (!email) {
    return NextResponse.json({ error: '이메일 누락' }, { status: 400 });
  }

  try {
    const response = await fetch(
      `${API_BASE}/api/auth/email/verify?email=${encodeURIComponent(email)}`,
      {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    // res.text() 대신 response.body를 그대로 전달
    return new NextResponse(response.body, {
      status: response.status,
      headers: {
        'Content-Type': response.headers.get('content-type') || 'text/plain',
      },
    });
  } catch (error) {
    console.error('[프록시 오류]', error);
    return NextResponse.json({ error: '프록시 실패' }, { status: 500 });
  }
}
