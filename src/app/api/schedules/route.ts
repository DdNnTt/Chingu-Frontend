import { NextResponse } from 'next/server';

// 스케줄 등록
export async function POST(request: Request) {
  try {
    await request.json(); // 요청 데이터 검증용

    return NextResponse.json(
      { message: '스케줄이 등록되었습니다.' },
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
    return NextResponse.json({ message: '스케줄 목록을 조회합니다.' });
  } catch {
    return NextResponse.json(
      { error: '스케줄 조회에 실패했습니다.' },
      { status: 400 }
    );
  }
}

// 스케줄 수정
export async function PUT(request: Request) {
  try {
    await request.json(); // 요청 데이터 검증용

    return NextResponse.json({ message: '스케줄이 수정되었습니다.' });
  } catch {
    return NextResponse.json(
      { error: '스케줄 수정에 실패했습니다.' },
      { status: 400 }
    );
  }
}

// 스케줄 삭제
export async function DELETE() {
  try {
    return NextResponse.json({ message: '스케줄이 삭제되었습니다.' });
  } catch {
    return NextResponse.json(
      { error: '스케줄 삭제에 실패했습니다.' },
      { status: 400 }
    );
  }
}
