import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const token = req.headers.get('authorization');
  const API_BASE = process.env.API_BASE_URL;

  if (!API_BASE) {
    return NextResponse.json({ message: 'API 주소 누락' }, { status: 500 });
  }

  const pathname = req.nextUrl.pathname;
  const match = pathname.match(/\/api\/groups\/([^/]+)\/albums/);
  const groupId = match?.[1]; // ✅ 안정적으로 groupId 추출

  if (!groupId) {
    return NextResponse.json({ message: 'groupId 누락' }, { status: 400 });
  }

  try {
    const res = await fetch(`${API_BASE}/api/groups/${groupId}/albums`, {
      method: 'GET',
      headers: {
        Authorization: token ?? '',
      },
    });

    const text = await res.text();

    try {
      const data = JSON.parse(text);
      return NextResponse.json(data, { status: res.status });
    } catch {
      return NextResponse.json({ message: text }, { status: res.status });
    }
  } catch (err) {
    console.error('[프록시 GET 오류]', err);
    return NextResponse.json({ message: '서버 오류' }, { status: 500 });
  }
}
