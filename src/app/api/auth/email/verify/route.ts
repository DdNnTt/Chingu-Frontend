// /app/api/auth/email/verify/route.ts
import { NextRequest, NextResponse } from 'next/server';

const API_BASE = process.env.API_BASE_URL;

export async function POST(req: NextRequest) {
  const email = req.nextUrl.searchParams.get('email');
  if (!email)
    return NextResponse.json({ error: '이메일 누락' }, { status: 400 });

  const res = await fetch(
    `${API_BASE}/api/auth/email/verify?email=${encodeURIComponent(email)}`,
    {
      method: 'POST',
      credentials: 'include', // 중요
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );

  const data = await res.text();
  return new NextResponse(data, { status: res.status });
}
