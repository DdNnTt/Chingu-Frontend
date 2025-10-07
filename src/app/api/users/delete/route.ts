import { NextRequest, NextResponse } from 'next/server';

export async function DELETE(req: NextRequest) {
  const token = req.headers.get('authorization');
  const API_BASE = process.env.API_BASE_URL;

  console.log('[회원 탈퇴 프록시] 토큰 확인:', token ? '존재' : '없음');
  console.log('[회원 탈퇴 프록시] API_BASE:', API_BASE);

  if (!API_BASE) {
    return NextResponse.json({ message: 'API 주소 누락' }, { status: 500 });
  }

  if (!token) {
    return NextResponse.json(
      { message: '인증 토큰이 필요합니다' },
      { status: 401 }
    );
  }

  try {
    const body = await req.json();

    const res = await fetch(`${API_BASE}/api/users/delete`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: token,
      },
      body: JSON.stringify(body),
    });

    const resultText = await res.text();

    let result;
    try {
      result = JSON.parse(resultText);
    } catch {
      result = { message: resultText };
    }

    return NextResponse.json(result, { status: res.status });
  } catch (error) {
    console.error('[회원 탈퇴 프록시 오류]', error);
    return NextResponse.json({ message: '서버 오류' }, { status: 500 });
  }
}
