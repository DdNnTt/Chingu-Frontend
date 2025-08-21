import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ groupId: string }> }
) {
  const { groupId } = await params;
  const { searchParams } = new URL(req.url);
  const extension = searchParams.get('extension') || 'jpg';
  const token = req.headers.get('authorization');

  const API_BASE = process.env.API_BASE_URL;

  if (!API_BASE) {
    console.error('[환경변수 오류] API_BASE_URL이 설정되지 않았습니다.');
    return NextResponse.json(
      { message: 'API 주소가 설정되지 않았습니다.' },
      { status: 500 }
    );
  }

  try {
    console.log(`[앨범 이미지 업로드 URL 요청] groupId: ${groupId}, extension: ${extension}, token: ${token ? 'present' : 'missing'}`);

    const backendRes = await fetch(
      `${API_BASE}/api/albums/${groupId}/upload-url?extension=${extension}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token ?? '',
        },
      }
    );

    const contentType = backendRes.headers.get('content-type');
    const rawText = await backendRes.text();

    console.log('[백엔드 응답 상태]', backendRes.status);
    console.log('[백엔드 응답 본문]', rawText);
    console.log('[백엔드 응답 타입]', contentType);

    if (!backendRes.ok) {
      return new NextResponse(rawText, {
        status: backendRes.status,
        headers: {
          'Content-Type': contentType ?? 'text/plain',
        },
      });
    }

    return new NextResponse(rawText, {
      status: backendRes.status,
      headers: {
        'Content-Type': contentType ?? 'application/json',
      },
    });
  } catch (error) {
    console.error('[앨범 이미지 업로드 URL 요청 오류]', error);
    return NextResponse.json(
      { message: '앨범 이미지 업로드 URL 요청 중 오류 발생' },
      { status: 500 }
    );
  }
}
