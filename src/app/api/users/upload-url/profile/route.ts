import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const extension = searchParams.get('extension') || 'jpg';

  // 허용된 확장자만 처리
  const allowedExtensions = ['jpg', 'jpeg', 'png'];
  if (!allowedExtensions.includes(extension.toLowerCase())) {
    return NextResponse.json(
      { message: '지원하지 않는 파일 형식입니다.' },
      { status: 400 }
    );
  }

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
    console.log(
      `[프로필 이미지 업로드 URL 요청] extension: ${extension}, token: ${token ? 'present' : 'missing'}`
    );

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000); // 30초 타임아웃

    const backendRes = await fetch(
      `${API_BASE}/api/users/upload-url/profile?extension=${extension}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token ?? '',
        },
        signal: controller.signal,
      }
    );

    clearTimeout(timeoutId);

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
    console.error('[프로필 이미지 업로드 URL 프록시 오류]', error);
    return NextResponse.json(
      { message: '프로필 이미지 업로드 URL 요청 중 오류 발생' },
      { status: 500 }
    );
  }
}
