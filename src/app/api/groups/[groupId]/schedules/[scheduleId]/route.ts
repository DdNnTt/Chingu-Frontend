import { NextResponse } from 'next/server';

// 그룹 스케줄 상세 조회
export async function GET(
  request: Request,
  { params }: { params: { groupId: string; scheduleId: string } }
) {
  try {
    const { groupId, scheduleId } = params;

    // TODO: 실제 데이터베이스 연동
    // 임시 응답
    return NextResponse.json({
      id: scheduleId,
      groupId,
      title: '그룹 미팅',
      description: '월간 회고 미팅',
      scheduleDate: '2024-03-20',
    });
  } catch {
    return NextResponse.json(
      { error: '그룹 스케줄 상세 조회에 실패했습니다.' },
      { status: 400 }
    );
  }
}

// 그룹 스케줄 삭제
export async function DELETE(
  request: Request,
  { params }: { params: { groupId: string; scheduleId: string } }
) {
  try {
    const { groupId, scheduleId } = params;

    // TODO: 실제 데이터베이스 연동
    // 임시 응답
    return NextResponse.json({
      message: '그룹 스케줄이 삭제되었습니다.',
      deletedId: scheduleId,
      groupId,
    });
  } catch {
    return NextResponse.json(
      { error: '그룹 스케줄 삭제에 실패했습니다.' },
      { status: 400 }
    );
  }
}
