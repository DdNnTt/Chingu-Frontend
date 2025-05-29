// /app/api/auth/email/confirm/route.ts
import { NextRequest, NextResponse } from 'next/server';

const API_BASE = process.env.API_BASE_URL;

export async function POST(req: NextRequest) {
  const email = req.nextUrl.searchParams.get('email');
  const code = req.nextUrl.searchParams.get('code');

  if (!email || !code) {
    return NextResponse.json(
      { error: '이메일 또는 인증 코드 누락' },
      { status: 400 }
    );
  }

  const res = await fetch(
    `${API_BASE}/api/auth/email/confirm?email=${encodeURIComponent(email)}&code=${encodeURIComponent(code)}`,
    {
      method: 'POST',
      credentials: 'include', // 인증번호 요청과 확인 시 동일한 쿠키/세션 유지 필요
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );

  const data = await res.text();
  return new NextResponse(data, { status: res.status });
}
