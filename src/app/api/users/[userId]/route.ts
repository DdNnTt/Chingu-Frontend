import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ userId: string }> }
) {
  const { userId } = await context.params;

  const API_BASE = process.env.API_BASE_URL;
  const token = req.headers.get('authorization');

  if (!API_BASE) {
    return NextResponse.json({ error: 'API_BASE_URL 누락됨' }, { status: 500 });
  }

  try {
    const res = await fetch(`${API_BASE}/api/users/${userId}`, {
      method: 'GET',
      headers: {
        Authorization: token || '',
      },
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.error('[사용자 정보 조회 실패]', res.status, errorText);
      return NextResponse.json(
        { error: '사용자 정보 조회 실패', status: res.status },
        { status: res.status }
      );
    }

    const text = await res.text();
    if (!text) {
      console.warn('[사용자 정보 응답 본문 없음]');
      return NextResponse.json(
        { error: '사용자 정보가 없습니다.' },
        { status: 404 }
      );
    }

    const data = JSON.parse(text);
    return NextResponse.json(data);
  } catch (err) {
    console.error('[사용자 정보 프록시 오류]', err);
    return NextResponse.json({ error: '서버 오류' }, { status: 500 });
  }
}
