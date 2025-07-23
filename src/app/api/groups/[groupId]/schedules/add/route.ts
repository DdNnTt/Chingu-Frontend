import { NextRequest, NextResponse } from 'next/server';

export async function POST(
  req: NextRequest,
  { params }: { params: { groupId: string } }
) {
  const token = req.headers.get('authorization');
  if (!token) {
    return NextResponse.json({ message: '권한 없음' }, { status: 401 });
  }

  const API_BASE = process.env.API_BASE_URL;
  if (!API_BASE) {
    return NextResponse.json({ message: 'API 주소 누락' }, { status: 500 });
  }

  try {
    const body = await req.json();
    const { groupId } = params;

    const res = await fetch(`${API_BASE}/api/groups/${groupId}/schedules`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: token,
      },
      body: JSON.stringify(body),
    });

    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (err) {
    console.error('[API 프록시 오류] 그룹 일정 추가 실패:', err);
    return NextResponse.json(
      { message: '서버 오류로 그룹 일정 추가에 실패했습니다.' },
      { status: 500 }
    );
  }
}
