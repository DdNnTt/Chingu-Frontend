import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const token = req.headers.get('authorization');
  const API_BASE = process.env.API_BASE_URL;

  if (!API_BASE) {
    return NextResponse.json({ message: 'API 주소 누락' }, { status: 500 });
  }

  const pathname = req.nextUrl.pathname;
  const match = pathname.match(/\/api\/groups\/([^/]+)\/albums/);
  const groupId = match?.[1]; // ✅ 안정적으로 groupId 추출

  if (!groupId) {
    return NextResponse.json({ message: 'groupId 누락' }, { status: 400 });
  }

  try {
    const res = await fetch(`${API_BASE}/api/groups/${groupId}/albums`, {
      method: 'GET',
      headers: {
        Authorization: token ?? '',
      },
    });

    const text = await res.text();

    try {
      const data = JSON.parse(text);
      return NextResponse.json(data, { status: res.status });
    } catch {
      return NextResponse.json({ message: text }, { status: res.status });
    }
  } catch (err) {
    console.error('[프록시 GET 오류]', err);
    return NextResponse.json({ message: '서버 오류' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const token = req.headers.get('authorization');
  const API_BASE = process.env.API_BASE_URL;

  if (!API_BASE) {
    return NextResponse.json({ message: 'API 주소 누락' }, { status: 500 });
  }

  const pathname = req.nextUrl.pathname;
  const match = pathname.match(/\/api\/groups\/([^/]+)\/albums/);
  const groupId = match?.[1]; // ✅ 안정적으로 groupId 추출

  if (!groupId) {
    return NextResponse.json({ message: 'groupId 누락' }, { status: 400 });
  }



  try {
    // 요청 body 파싱
    const body = await req.json();
    
    console.log('[앨범 생성 프록시] 요청 데이터:', {
      groupId,
      body,
      token: token ? `${token.substring(0, 20)}...` : 'null',
      tokenFormat: token ? (token.startsWith('Bearer ') ? 'Bearer 포함됨' : 'Bearer 없음') : 'null',
      API_BASE,
    });
    
    // 백엔드 API 호출
    const res = await fetch(`${API_BASE}/api/groups/${groupId}/albums`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: token ?? '',
      },
      body: JSON.stringify(body),
    });

    console.log('[앨범 생성 프록시] 백엔드 응답:', {
      status: res.status,
      statusText: res.statusText,
      headers: Object.fromEntries(res.headers.entries()),
    });

    const text = await res.text();
    console.log('[앨범 생성 프록시] 백엔드 응답 텍스트:', text);
    console.log('[앨범 생성 프록시] 백엔드 응답 상세:', {
      url: `${API_BASE}/api/groups/${groupId}/albums`,
      requestBody: body,
      responseStatus: res.status,
      responseText: text
    });

    try {
      const data = JSON.parse(text);
      console.log('[앨범 생성 프록시] 파싱된 응답 데이터:', data);
      return NextResponse.json(data, { status: res.status });
    } catch (parseError) {
      console.error('[앨범 생성 프록시] JSON 파싱 실패:', parseError);
      return NextResponse.json({ message: text, error: 'JSON 파싱 실패' }, { status: res.status });
    }
  } catch (err) {
    console.error('[프록시 POST 오류]', err);
    return NextResponse.json({ 
      message: '서버 오류', 
      error: err instanceof Error ? err.message : String(err) 
    }, { status: 500 });
  }
}
