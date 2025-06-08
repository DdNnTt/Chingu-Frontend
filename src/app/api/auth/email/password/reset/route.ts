import { NextRequest, NextResponse } from 'next/server';

const API_BASE = process.env.API_BASE_URL;

export async function POST(req: NextRequest) {
  try {
    const { email, newPassword, code } = await req.json(); // 👈 body가 아니라 query에 있어야 함!

    const url = `${API_BASE}/api/auth/email/password/reset?email=${encodeURIComponent(
      email
    )}&newPassword=${encodeURIComponent(newPassword)}&code=${encodeURIComponent(code)}`;

    console.log('[🔐 최종 요청 URL]', url);

    const backendRes = await fetch(url, {
      method: 'POST',
      headers: {
        Accept: '*/*',
      },
    });

    const text = await backendRes.text();

    return new NextResponse(text, {
      status: backendRes.status,
      headers: {
        'Content-Type': 'text/plain',
      },
    });
  } catch (error) {
    console.error('[❌ 프록시 서버 오류]', error);
    return NextResponse.json({ message: '프록시 서버 오류' }, { status: 500 });
  }
}
