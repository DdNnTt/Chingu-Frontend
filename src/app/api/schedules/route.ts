import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, description, scheduleDate } = body;

    if (!title || !description || !scheduleDate) {
      return NextResponse.json(
        { error: '필수 입력 항목이 누락되었습니다.' },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        message: '일정이 성공적으로 등록되었습니다.',
        schedule: {
          title,
          description,
          scheduleDate,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('일정 생성 중 오류가 발생했습니다:', error);
    return NextResponse.json(
      { error: '일정 등록에 실패했습니다.' },
      { status: 500 }
    );
  }
}
