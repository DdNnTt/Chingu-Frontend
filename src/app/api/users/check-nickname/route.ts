// /app/api/users/check-nickname/route.ts
import { NextRequest, NextResponse } from 'next/server';

const API_BASE = process.env.API_BASE_URL; // 예: http://3.34.181.113:8080

export async function GET(req: NextRequest) {
  const nickname = req.nextUrl.searchParams.get('nickname');
  if (!nickname) {
    return NextResponse.json({ error: '닉네임 누락' }, { status: 400 });
  }

  try {
    const res = await fetch(
      `${API_BASE}/api/users/check-nickname?nickname=${encodeURIComponent(nickname)}`
    );
    const result = await res.json();

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: '서버 오류' }, { status: 500 });
  }
}
