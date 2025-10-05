import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const API_BASE = process.env.API_BASE_URL;
  const token = req.headers.get('authorization');

  console.log('[마이페이지 API] 토큰:', token ? '존재' : '없음');
  console.log('[마이페이지 API] API_BASE:', API_BASE);

  try {
    console.log(
      '[마이페이지 API] 백엔드 호출:',
      `${API_BASE}/api/users/mypage`
    );

    const res = await fetch(`${API_BASE}/api/users/mypage`, {
      method: 'GET',
      headers: {
        Authorization: token || '',
      },
    });

    console.log('[마이페이지 API] 백엔드 응답 상태:', res.status);
    const data = await res.json();
    console.log('[마이페이지 API] 백엔드 응답 데이터:', data);

    return NextResponse.json(data);
  } catch (err) {
    console.error('[마이페이지 프록시 오류]', err);
    return NextResponse.json({ error: '서버 오류' }, { status: 500 });
  }
}
