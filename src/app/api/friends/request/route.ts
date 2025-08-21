import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const token = req.headers.get('authorization');
  const API_BASE = process.env.API_BASE_URL;

  if (!API_BASE) {
    return NextResponse.json({ message: 'API 주소 누락' }, { status: 500 });
  }

  if (!token) {
    return NextResponse.json({ message: '인증 토큰이 필요합니다' }, { status: 401 });
  }

  try {
    const body = await req.json();
    
    console.log('[친구 신청 프록시] 요청 데이터:', {
      body,
      token: token ? `${token.substring(0, 20)}...` : 'null',
      API_BASE,
    });

    const response = await fetch(`${API_BASE}/api/friends/request`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': token,
      },
      body: JSON.stringify(body),
    });

    console.log('[친구 신청 프록시] 백엔드 응답:', {
      status: response.status,
      statusText: response.statusText,
      headers: Object.fromEntries(response.headers.entries()),
    });

    const text = await response.text();
    console.log('[친구 신청 프록시] 백엔드 응답 텍스트:', text);

    try {
      const data = JSON.parse(text);
      return NextResponse.json(data, { status: response.status });
    } catch (parseError) {
      console.error('[친구 신청 프록시] JSON 파싱 실패:', parseError);
      return NextResponse.json({ message: text, error: 'JSON 파싱 실패' }, { status: response.status });
    }
  } catch (error) {
    console.error('[친구 신청 프록시 오류]', error);
    return NextResponse.json(
      { 
        message: '서버 오류', 
        error: error instanceof Error ? error.message : String(error) 
      },
      { status: 500 }
    );
  }
}