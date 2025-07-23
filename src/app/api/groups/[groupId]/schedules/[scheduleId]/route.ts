import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  req: NextRequest,
  { params }: { params: { groupId: string; scheduleId: string } }
) {
  const { groupId, scheduleId } = params;
  const token = req.headers.get('authorization');

  if (!token) {
    return NextResponse.json({ message: '권한 없음' }, { status: 401 });
  }

  const API_BASE = process.env.API_BASE_URL;
  if (!API_BASE) {
    return NextResponse.json({ message: 'API 주소 누락' }, { status: 500 });
  }

  try {
    const response = await fetch(
      `${API_BASE}/api/groups/${groupId}/schedules/${scheduleId}`,
      {
        headers: { Authorization: token },
        cache: 'no-store',
      }
    );

    const text = await response.text();
    const data = JSON.parse(text);

    if (!response.ok) {
      return NextResponse.json(
        { message: data.message || '일정 상세 조회 실패' },
        { status: response.status }
      );
    }

    return NextResponse.json(data, { status: 200 });
  } catch (err) {
    console.error('[일정 상세 조회 오류]', err);
    return NextResponse.json(
      { message: '일정 상세 조회 중 오류 발생' },
      { status: 500 }
    );
  }
}
