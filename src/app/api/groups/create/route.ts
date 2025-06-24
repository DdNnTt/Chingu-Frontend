import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const token = req.headers.get('authorization');
    const body = await req.json();

    const res = await fetch(`${process.env.API_BASE_URL}/api/groups/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: token || '',
      },
      body: JSON.stringify(body),
    });

    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (err) {
    console.error('[API 프록시 오류] 그룹 생성 실패:', err);
    return NextResponse.json(
      { message: '서버 오류로 그룹 생성에 실패했습니다.' },
      { status: 500 }
    );
  }
}
