import { NextRequest, NextResponse } from 'next/server';

export async function DELETE(
  req: NextRequest,
  context: { params: { groupId: string } }
) {
  const token = req.headers.get('authorization');
  const { groupId } = context.params;

  try {
    const res = await fetch(
      `${process.env.API_BASE_URL}/api/groups/${groupId}`,
      {
        method: 'DELETE',
        headers: {
          Authorization: token || '',
        },
      }
    );

    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (error) {
    console.error('[그룹 삭제 API 프록시 오류]', error);
    return NextResponse.json(
      { message: '그룹 삭제 중 서버 오류 발생' },
      { status: 500 }
    );
  }
}
