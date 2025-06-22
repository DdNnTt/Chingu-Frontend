import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { groupName, description } = body;

    if (!groupName) {
      return NextResponse.json(
        { error: '그룹명은 필수입니다.' },
        { status: 400 }
      );
    }

    const newGroup = {
      groupId: Math.floor(Math.random() * 1000),
      groupName,
      description,
      createdAt: new Date().toISOString(),
    };

    return NextResponse.json(newGroup, { status: 200 });
  } catch (err) {
    console.error('[그룹 생성 API 에러]', err);
    return NextResponse.json({ error: '서버 에러 발생' }, { status: 500 });
  }
}
