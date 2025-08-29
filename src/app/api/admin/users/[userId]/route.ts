import { NextRequest, NextResponse } from 'next/server';

export async function DELETE(
  req: NextRequest,
  { params }: { params: { userId: string } }
) {
  const API_BASE = process.env.API_BASE_URL;
  const token = req.headers.get('authorization');
  const { userId } = params;

  if (!API_BASE) {
    return NextResponse.json({ error: 'API_BASE_URL 누락됨' }, { status: 500 });
  }

  if (!token) {
    return NextResponse.json(
      { error: '인증 토큰이 필요합니다' },
      { status: 401 }
    );
  }

  if (!userId) {
    return NextResponse.json(
      { error: '사용자 ID가 필요합니다' },
      { status: 400 }
    );
  }

  try {
    const res = await fetch(`${API_BASE}/api/admin/users/${userId}`, {
      method: 'DELETE',
      headers: {
        Authorization: token,
      },
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.error('[회원 삭제 실패]', res.status, errorText);
      return NextResponse.json(
        { error: '회원 삭제 실패', status: res.status },
        { status: res.status }
      );
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (err) {
    console.error('[회원 삭제 프록시 오류]', err);
    return NextResponse.json({ error: '서버 오류' }, { status: 500 });
  }
}
