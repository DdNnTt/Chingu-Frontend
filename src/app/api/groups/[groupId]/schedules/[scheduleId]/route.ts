import { NextResponse } from 'next/server';

// 그룹 스케줄 상세 조회
export async function GET() {
  try {
    return NextResponse.json({
      message: '그룹 스케줄 상세 정보를 조회합니다.',
    });
  } catch {
    return NextResponse.json(
      { error: '그룹 스케줄 상세 조회에 실패했습니다.' },
      { status: 400 }
    );
  }
}

// 그룹 스케줄 삭제
export async function DELETE() {
  try {
    return NextResponse.json({ message: '그룹 스케줄이 삭제되었습니다.' });
  } catch {
    return NextResponse.json(
      { error: '그룹 스케줄 삭제에 실패했습니다.' },
      { status: 400 }
    );
  }
}
