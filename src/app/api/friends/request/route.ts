import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const API_BASE = process.env.API_BASE_URL;
  const token = req.headers.get('authorization');

  console.log('[친구 신청 API] API_BASE:', API_BASE);
  console.log('[친구 신청 API] 토큰 존재:', !!token);

  if (!API_BASE) {
    return NextResponse.json({ error: 'API_BASE_URL 누락됨' }, { status: 500 });
  }

  if (!token) {
    return NextResponse.json(
      { error: '인증 토큰이 필요합니다' },
      { status: 401 }
    );
  }

  try {
    const body = await req.json();
    const { friendId } = body;

    console.log('[친구 신청 API] 요청 body:', body);
    console.log(
      '[친구 신청 API] friendId:',
      friendId,
      '타입:',
      typeof friendId
    );

    if (!friendId || typeof friendId !== 'number') {
      return NextResponse.json(
        { error: '유효한 friendId가 필요합니다' },
        { status: 400 }
      );
    }

    const requestUrl = `${API_BASE}/api/friends/request`;
    console.log('[친구 신청 API] 백엔드 요청 URL:', requestUrl);

    const res = await fetch(requestUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: token,
      },
      body: JSON.stringify({ friendId }),
    });

    console.log('[친구 신청 API] 백엔드 응답 상태:', res.status);

    if (!res.ok) {
      const errorText = await res.text();
      console.error('[친구 신청 응답 실패]', res.status, errorText);
      console.log('[친구 신청 API] 에러 텍스트 타입:', typeof errorText);
      console.log('[친구 신청 API] 에러 텍스트 길이:', errorText.length);

      // 이미 친구인 경우는 성공으로 처리
      if (res.status === 400) {
        console.log('[친구 신청 API] 400 에러 감지, JSON 파싱 시도');
        try {
          const errorData = JSON.parse(errorText);
          console.log('[친구 신청 API] 파싱된 에러 데이터:', errorData);
          console.log('[친구 신청 API] message 필드:', errorData.message);

          if (errorData.message === '이미 친구입니다.') {
            console.log('[친구 신청 API] 이미 친구 관계임 - 200으로 변경');
            return NextResponse.json(
              {
                message: '이미 친구입니다.',
                timestamp: errorData.timestamp || new Date().toISOString(),
              },
              { status: 200 }
            );
          } else {
            console.log('[친구 신청 API] 다른 메시지:', errorData.message);
          }
        } catch (parseError) {
          console.error('[JSON 파싱 오류]', parseError);
          console.log('[친구 신청 API] 파싱 실패한 원본 텍스트:', errorText);
        }
      }

      console.log('[친구 신청 API] 원본 상태 코드로 반환:', res.status);
      return NextResponse.json(
        { error: '친구 신청 실패', details: errorText, status: res.status },
        { status: res.status }
      );
    }

    const data = await res.json();
    console.log('[친구 신청 API] 성공 응답:', data);
    return NextResponse.json(data);
  } catch (err) {
    console.error('[친구 신청 프록시 오류]', err);
    return NextResponse.json(
      {
        error: '서버 오류',
        details: err instanceof Error ? err.message : '알 수 없는 오류',
      },
      { status: 500 }
    );
  }
}
