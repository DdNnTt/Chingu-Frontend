import { NextRequest, NextResponse } from 'next/server';

export async function DELETE(
  req: NextRequest,
  { params }: { params: { friendId: string } }
) {
  const API_BASE = process.env.API_BASE_URL;
  const token = req.headers.get('authorization');
  const { friendId } = params;

  console.log('[친구 삭제 API] friendUserId:', friendId);

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

    console.log('[친구 삭제 API] 백엔드 응답 상태:', res.status);

    if (!res.ok) {
      const errorText = await res.text();
      console.error('[친구 삭제 응답 실패]', res.status, errorText);
      return NextResponse.json(
        { error: '친구 삭제 실패', details: errorText, status: res.status },
        { status: res.status }
      );
    }

    const data = await res.json();
    console.log('[친구 삭제 API] 성공 응답:', data);
    return NextResponse.json(data);
  } catch (err) {
    console.error('[친구 삭제 프록시 오류]', err);
    return NextResponse.json({ error: '서버 오류' }, { status: 500 });
  }
}
