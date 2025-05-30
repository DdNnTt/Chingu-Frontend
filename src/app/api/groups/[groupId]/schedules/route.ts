import { NextResponse } from 'next/server';

// 그룹 스케줄 등록
export async function POST(
  request: Request,
  { params }: { params: { groupId: string } }
) {
  try {
    const body = await request.json();
    const { title, description, scheduleDate } = body;
    const { groupId } = params;

    // TODO: 실제 데이터베이스 연동
    // 임시 응답
    return NextResponse.json(
      {
        id: 1,
        groupId,
        title,
        description,
        scheduleDate,
      },
      { status: 201 }
    );
  } catch {
    return NextResponse.json(
      { error: '그룹 스케줄 등록에 실패했습니다.' },
      { status: 400 }
    );
  }
}

// 그룹 스케줄 목록 조회
export async function GET(
  request: Request,
  { params }: { params: { groupId: string } }
) {
  try {
    const { groupId } = params;

    // TODO: 실제 데이터베이스 연동
    // 임시 응답
    return NextResponse.json([
      {
        id: 1,
        groupId,
        title: '그룹 미팅',
        description: '월간 회고 미팅',
        scheduleDate: '2024-03-20',
      },
      {
        id: 2,
        groupId,
        title: '그룹 점심',
        description: '팀 점심 모임',
        scheduleDate: '2024-03-21',
      },
    ]);
  } catch {
    return NextResponse.json(
      { error: '그룹 스케줄 조회에 실패했습니다.' },
      { status: 400 }
    );
  }
}
