import { NextRequest, NextResponse } from 'next/server';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function GET(req: NextRequest, context: any) {
  const userId = context?.params?.userId;

  if (typeof userId !== 'string') {
    return NextResponse.json(
      { error: '유효하지 않은 userId' },
      { status: 400 }
    );
  }

  const API_BASE = process.env.API_BASE_URL;

  if (!API_BASE) {
    return NextResponse.json({ error: 'API_BASE_URL 누락됨' }, { status: 500 });
  }

  try {
    const res = await fetch(`${API_BASE}/api/users/${userId}`, {
      method: 'GET',
    });

    if (!res.ok) {
      const errorText = await res.text();
      return NextResponse.json(
        { error: '유저 조회 실패', details: errorText },
        { status: res.status }
      );
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (err) {
    console.error('[유저 조회 오류]', err);
    return NextResponse.json({ error: '서버 오류' }, { status: 500 });
  }
}
