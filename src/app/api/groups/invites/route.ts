import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const token = req.headers.get('authorization');

  try {
    const res = await fetch(`${process.env.API_BASE_URL}/api/groups/invites`, {
      method: 'GET',
      headers: {
        Authorization: token || '',
        'Content-Type': 'application/json',
      },
    });

    if (!res.ok) {
      return NextResponse.json(
        { message: '초대 목록 조회 실패' },
        { status: res.status }
      );
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('[API ERROR] 초대 목록 조회 실패:', error);
    return NextResponse.json(
      { message: '서버 오류로 초대 목록을 불러오지 못했습니다.' },
      { status: 500 }
    );
  }
}
