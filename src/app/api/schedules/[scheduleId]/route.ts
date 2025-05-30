import { NextResponse } from 'next/server';

interface RouteParams {
  params: {
    scheduleId: string;
  };
}

export async function PUT(request: Request, { params }: RouteParams) {
  try {
    const { scheduleId } = params;
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
        message: '일정이 성공적으로 수정되었습니다.',
        schedule: {
          id: scheduleId,
          title,
          description,
          scheduleDate,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('일정 수정 중 오류가 발생했습니다:', error);
    return NextResponse.json(
      { error: '일정 수정에 실패했습니다.' },
      { status: 500 }
    );
  }
}
