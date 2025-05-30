import { NextResponse } from 'next/server';

// 스케줄 등록
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, description, scheduleDate } = body;

    // TODO: 실제 데이터베이스 연동
    // 임시 응답
    return NextResponse.json(
      {
        id: 1,
        user: {
          id: 123,
          nickname: '사용자1',
        },
        title,
        description,
        scheduleDate,
      },
      { status: 201 }
    );
  } catch {
    return NextResponse.json(
      { error: '스케줄 등록에 실패했습니다.' },
      { status: 400 }
    );
  }
}

// 스케줄 조회
export async function GET() {
  try {
    // TODO: 실제 데이터베이스 연동
    // 임시 응답
    return NextResponse.json([
      {
        id: 1,
        user: {
          id: 123,
          nickname: '사용자1',
        },
        title: '회의 일정',
        description: '팀 미팅',
        scheduleDate: '2024-03-20',
      },
      {
        id: 2,
        user: {
          id: 123,
          nickname: '사용자1',
        },
        title: '점심 약속',
        description: '친구와 점심',
        scheduleDate: '2024-03-21',
      },
    ]);
  } catch {
    return NextResponse.json(
      { error: '스케줄 조회에 실패했습니다.' },
      { status: 400 }
    );
  }
}

// 스케줄 수정
export async function PUT(
  request: Request,
  { params }: { params: { scheduleId: string } }
) {
  try {
    const body = await request.json();
    const { title, description, scheduleDate } = body;
    const { scheduleId } = params;

    // TODO: 실제 데이터베이스 연동
    // 임시 응답
    return NextResponse.json({
      id: scheduleId,
      user: {
        id: 123,
        nickname: '사용자1',
      },
      title,
      description,
      scheduleDate,
    });
  } catch {
    return NextResponse.json(
      { error: '스케줄 수정에 실패했습니다.' },
      { status: 400 }
    );
  }
}

// 스케줄 삭제
export async function DELETE(
  request: Request,
  { params }: { params: { scheduleId: string } }
) {
  try {
    const { scheduleId } = params;

    // TODO: 실제 데이터베이스 연동
    // 임시 응답
    return NextResponse.json({
      message: '스케줄이 삭제되었습니다.',
      deletedId: scheduleId,
    });
  } catch {
    return NextResponse.json(
      { error: '스케줄 삭제에 실패했습니다.' },
      { status: 400 }
    );
  }
}
