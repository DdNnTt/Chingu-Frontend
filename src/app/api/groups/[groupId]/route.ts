import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ groupId: string }> }
) {
  const { groupId } = await params;
  const token = req.headers.get('authorization');
  const API_BASE = process.env.API_BASE_URL;

  if (!API_BASE) {
    return NextResponse.json({ message: 'API 주소 누락' }, { status: 500 });
  }

  if (!groupId) {
    return NextResponse.json({ message: 'groupId 누락' }, { status: 400 });
  }

  try {
    console.log('[그룹 상세 프록시] 요청 데이터:', {
      groupId,
      token: token ? `${token.substring(0, 20)}...` : 'null',
      API_BASE,
    });

    const res = await fetch(`${API_BASE}/api/groups/${groupId}`, {
      method: 'GET',
      headers: {
        Authorization: token ?? '',
      },
    });

    console.log('[그룹 상세 프록시] 백엔드 응답:', {
      status: res.status,
      statusText: res.statusText,
      headers: Object.fromEntries(res.headers.entries()),
    });

    const text = await res.text();
    console.log('[그룹 상세 프록시] 백엔드 응답 텍스트:', text);

    try {
      const data = JSON.parse(text);
      console.log('[그룹 상세 프록시] 파싱된 응답 데이터:', data);
      return NextResponse.json(data, { status: res.status });
    } catch (parseError) {
      console.error('[그룹 상세 프록시] JSON 파싱 실패:', parseError);
      return NextResponse.json({ message: text, error: 'JSON 파싱 실패' }, { status: res.status });
    }
  } catch (err) {
    console.error('[그룹 상세 프록시 오류]', err);
    return NextResponse.json({ 
      message: '서버 오류', 
      error: err instanceof Error ? err.message : String(err) 
    }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ groupId: string }> }
) {
  const { groupId } = await params;
  const token = req.headers.get('authorization');
  const API_BASE = process.env.API_BASE_URL;

  if (!API_BASE) {
    return NextResponse.json({ message: 'API 주소 누락' }, { status: 500 });
  }

  if (!groupId) {
    return NextResponse.json({ message: 'groupId 누락' }, { status: 400 });
  }

  if (!token) {
    return NextResponse.json({ message: '인증 토큰이 필요합니다' }, { status: 401 });
  }

  try {
    console.log('[그룹 탈퇴 프록시] 요청 데이터:', {
      groupId,
      token: token ? `${token.substring(0, 20)}...` : 'null',
      API_BASE,
    });

    const res = await fetch(`${API_BASE}/api/groups/${groupId}`, {
      method: 'DELETE',
      headers: {
        Authorization: token,
      },
    });

    console.log('[그룹 탈퇴 프록시] 백엔드 응답:', {
      status: res.status,
      statusText: res.statusText,
      headers: Object.fromEntries(res.headers.entries()),
    });

    const text = await res.text();
    console.log('[그룹 탈퇴 프록시] 백엔드 응답 텍스트:', text);

    if (!res.ok) {
      let errorMessage = '그룹 탈퇴 실패';
      try {
        const errorData = JSON.parse(text);
        errorMessage = errorData.message || errorMessage;
      } catch {
        errorMessage = text || errorMessage;
      }
      return NextResponse.json({ message: errorMessage }, { status: res.status });
    }

    try {
      const data = JSON.parse(text);
      console.log('[그룹 탈퇴 프록시] 파싱된 응답 데이터:', data);
      return NextResponse.json(data, { status: res.status });
    } catch (parseError) {
      console.error('[그룹 탈퇴 프록시] JSON 파싱 실패:', parseError);
      return NextResponse.json({ message: '그룹 탈퇴 성공' }, { status: 200 });
    }
  } catch (err) {
    console.error('[그룹 탈퇴 프록시 오류]', err);
    return NextResponse.json({ 
      message: '서버 오류', 
      error: err instanceof Error ? err.message : String(err) 
    }, { status: 500 });
  }
}
