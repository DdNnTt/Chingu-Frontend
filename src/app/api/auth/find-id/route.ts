import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const API_BASE = process.env.API_BASE_URL;
  if (!API_BASE) {
    return NextResponse.json({ message: 'API 주소 누락' }, { status: 500 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const name = searchParams.get('name');
    const email = searchParams.get('email');

    const res = await fetch(
      `${API_BASE}/api/users/find-userId?name=${encodeURIComponent(name ?? '')}&email=${encodeURIComponent(email ?? '')}`,
      {
        method: 'GET',
        headers: { Accept: '*/*' },
      }
    );

    const contentType = res.headers.get('content-type');
    const isJson = contentType?.includes('application/json');
    // const isText = contentType?.includes('text/plain');

    if (!res.ok) {
      const error = isJson ? await res.json() : await res.text();
      return NextResponse.json({ message: error }, { status: res.status });
    }

    const responseBody = isJson ? await res.json() : await res.text();
    return NextResponse.json({ userId: responseBody }); // ✅ 여기가 핵심
  } catch (err) {
    console.error('[아이디 찾기 프록시 에러]', err);
    return NextResponse.json({ message: '서버 오류 발생' }, { status: 500 });
  }
}
