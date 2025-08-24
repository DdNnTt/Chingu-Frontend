import { NextRequest, NextResponse } from 'next/server';

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { friendId, status } = body;

    // 토큰 가져오기
    const token = request.cookies.get('accessToken')?.value;
    if (!token) {
      return NextResponse.json(
        { message: '인증 토큰이 필요합니다.' },
        { status: 401 }
      );
    }

    // 백엔드 API 호출
    const API_BASE = process.env.API_BASE_URL;
    if (!API_BASE) {
      console.error('API_BASE_URL 환경변수가 설정되지 않았습니다.');
      return NextResponse.json(
        { message: '서버 설정 오류가 발생했습니다.' },
        { status: 500 }
      );
    }

    const response = await fetch(`${API_BASE}/api/friends/respond`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ friendId, status }),
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(data, { status: response.status });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('친구 요청 응답 처리 오류:', error);
    return NextResponse.json(
      { message: '서버 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
