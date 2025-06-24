import { NextRequest, NextResponse } from 'next/server';

export async function DELETE(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const groupId = searchParams.get('groupId');
  const token = req.headers.get('authorization');

  if (!groupId) {
    return NextResponse.json({ message: 'groupId 누락' }, { status: 400 });
  }

  try {
    const res = await fetch(
      `${process.env.API_BASE_URL}/api/groups/${groupId}`,
      {
        method: 'DELETE',
        headers: {
          Authorization: token ?? '',
        },
      }
    );

    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (error) {
    console.error('[그룹 삭제 실패]', error);
    return NextResponse.json({ message: '서버 오류' }, { status: 500 });
  }
}
