import { NextRequest, NextResponse } from 'next/server';

export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ friendId: string }> }
) {
  const { friendId } = await context.params;

  const API_BASE = process.env.API_BASE_URL;
  const token = req.headers.get('authorization');

  if (!API_BASE) {
    return NextResponse.json({ error: 'API_BASE_URL 누락됨' }, { status: 500 });
  }

  if (!token) {
    return NextResponse.json(
      { error: '인증 토큰이 필요합니다' },
      { status: 401 }
    );
  }

  try {
    const res = await fetch(`${API_BASE}/api/friends/${friendId}`, {
      method: 'DELETE',
      headers: {
        Authorization: token,
      },
    });

    if (!res.ok) {
      const errorText = await res.text();
      return NextResponse.json(
        { error: '친구 삭제 실패', details: errorText },
        { status: res.status }
      );
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (err) {
    console.error('[친구 삭제 오류]', err);
    return NextResponse.json({ error: '서버 오류' }, { status: 500 });
  }
}
