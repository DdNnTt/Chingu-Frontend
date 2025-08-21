import { NextRequest, NextResponse } from 'next/server';

export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ groupId: string; scheduleId: string }> }
) {
  try {
    const token = req.headers.get('authorization');
    const { groupId, scheduleId } = await context.params;

    if (!token) {
      return NextResponse.json({ message: '권한 없음' }, { status: 401 });
    }

    const API_BASE = process.env.API_BASE_URL;
    if (!API_BASE) {
      return NextResponse.json({ message: 'API 주소 누락' }, { status: 500 });
    }

    const res = await fetch(
      `${API_BASE}/api/groups/${groupId}/schedules/${scheduleId}`,
      {
        method: 'DELETE',
        headers: {
          Authorization: token,
        },
      }
    );

    const contentType = res.headers.get('content-type');
    const isJson = contentType?.includes('application/json');
    const responseBody = isJson ? await res.json() : await res.text();

    if (!res.ok) {
      return NextResponse.json(
        {
          message:
            typeof responseBody === 'object'
              ? responseBody.message || '일정 삭제 실패'
              : '일정 삭제 실패',
        },
        { status: res.status }
      );
    }

    return NextResponse.json(responseBody, { status: 200 });
  } catch (err) {
    console.error('[API 프록시 오류] 그룹 일정 삭제 실패:', err);
    return NextResponse.json(
      { message: '서버 오류로 그룹 일정 삭제에 실패했습니다.' },
      { status: 500 }
    );
  }
}
