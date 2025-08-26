import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ groupId: string; memoryId: string }> }
) {
  const token = req.headers.get('authorization');
  const API_BASE = process.env.API_BASE_URL;
  const { groupId, memoryId } = await params;

  if (!API_BASE) {
    return NextResponse.json({ message: 'API 주소 누락' }, { status: 500 });
  }

  if (!groupId || !memoryId) {
    return NextResponse.json(
      { message: 'groupId 또는 memoryId 누락' },
      { status: 400 }
    );
  }

  try {
    console.log('[앨범 상세 프록시] 요청 데이터:', {
      groupId,
      memoryId,
      token: token ? `${token.substring(0, 20)}...` : 'null',
      API_BASE,
    });

    const res = await fetch(
      `${API_BASE}/api/groups/${groupId}/albums/${memoryId}`,
      {
        method: 'GET',
        headers: {
          Authorization: token ?? '',
        },
      }
    );

    console.log('[앨범 상세 프록시] 백엔드 응답:', {
      status: res.status,
      statusText: res.statusText,
      headers: Object.fromEntries(res.headers.entries()),
    });

    const text = await res.text();
    console.log('[앨범 상세 프록시] 백엔드 응답 텍스트:', text);

    try {
      const data = JSON.parse(text);
      console.log('[앨범 상세 프록시] 파싱된 응답 데이터:', data);
      return NextResponse.json(data, { status: res.status });
    } catch (parseError) {
      console.error('[앨범 상세 프록시] JSON 파싱 실패:', parseError);
      return NextResponse.json({ message: text }, { status: res.status });
    }
  } catch (err) {
    console.error('[앨범 상세 프록시 GET 오류]', err);
    return NextResponse.json({ message: '서버 오류' }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ groupId: string; memoryId: string }> }
) {
  const token = req.headers.get('authorization');
  const API_BASE = process.env.API_BASE_URL;
  const { groupId, memoryId } = await params;

  if (!API_BASE) {
    return NextResponse.json({ message: 'API 주소 누락' }, { status: 500 });
  }

  if (!groupId || !memoryId) {
    return NextResponse.json(
      { message: 'groupId 또는 memoryId 누락' },
      { status: 400 }
    );
  }

  try {
    console.log('[앨범 삭제 프록시] 요청 데이터:', {
      groupId,
      memoryId,
      token: token ? `${token.substring(0, 20)}...` : 'null',
      API_BASE,
    });

    const res = await fetch(
      `${API_BASE}/api/groups/${groupId}/albums/${memoryId}`,
      {
        method: 'DELETE',
        headers: {
          Authorization: token ?? '',
        },
      }
    );

    console.log('[앨범 삭제 프록시] 백엔드 응답:', {
      status: res.status,
      statusText: res.statusText,
      headers: Object.fromEntries(res.headers.entries()),
    });

    const text = await res.text();
    console.log('[앨범 삭제 프록시] 백엔드 응답 텍스트:', text);

    try {
      const data = JSON.parse(text);
      console.log('[앨범 삭제 프록시] 파싱된 응답 데이터:', data);
      return NextResponse.json(data, { status: res.status });
    } catch (parseError) {
      console.error('[앨범 삭제 프록시] JSON 파싱 실패:', parseError);
      return NextResponse.json({ message: text }, { status: res.status });
    }
  } catch (err) {
    console.error('[앨범 삭제 프록시 DELETE 오류]', err);
    return NextResponse.json({ message: '서버 오류' }, { status: 500 });
  }
}
