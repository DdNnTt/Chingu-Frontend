import { NextRequest, NextResponse } from 'next/server';

// ✅ 일정 조회용 GET 메서드 추가
export async function GET(
  req: NextRequest,
  { params }: { params: { groupId: string } }
) {
  try {
    const token = req.headers.get('authorization');
    const { groupId } = params;

    const res = await fetch(
      `${process.env.API_BASE_URL}/api/groups/${groupId}/schedules`,
      {
        method: 'GET',
        headers: {
          Authorization: token || '',
        },
      }
    );

    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (err) {
    console.error('[API 프록시 오류] 그룹 일정 조회 실패:', err);
    return NextResponse.json(
      { message: '서버 오류로 그룹 일정 조회에 실패했습니다.' },
      { status: 500 }
    );
  }
}

// 기존 POST 그대로 유지
export async function POST(
  req: NextRequest,
  { params }: { params: { groupId: string } }
) {
  try {
    const token = req.headers.get('authorization');
    const body = await req.json();
    const { groupId } = params;

    const res = await fetch(
      `${process.env.API_BASE_URL}/api/groups/${groupId}/schedules`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token || '',
        },
        body: JSON.stringify(body),
      }
    );

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
