import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const nickname = searchParams.get('nickname');
  const API_BASE = process.env.API_BASE_URL;

  const cookieStore = await cookies();
  const token = cookieStore.get('accessToken')?.value;

  if (!nickname) {
    return NextResponse.json({ error: '닉네임이 없습니다' }, { status: 400 });
  }

  if (!API_BASE) {
    return NextResponse.json({ error: 'API 주소가 없습니다' }, { status: 500 });
  }

  try {
    const url = `${API_BASE}/api/users/check-nickname?nickname=${encodeURIComponent(nickname)}`;
    console.log('[닉네임 중복 확인 요청]', decodeURIComponent(url));

    const res = await fetch(url, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
      },
    });

    const text = await res.text();

    if (!res.ok) {
      throw new Error(`백엔드 응답 오류: ${res.status} ${text}`);
    }

    // 응답 본문 파싱
    let result;
    if (text === 'true') {
      result = true; // 문자열 true → boolean true
    } else if (text === 'false') {
      result = false; // 문자열 false → boolean false
    } else {
      try {
        // JSON 형식인 경우 파싱 시도
        result = JSON.parse(text);
      } catch (jsonErr) {
        // 파싱 실패 시 로그 출력 후 예외 발생
        console.error('[jsonErr]', jsonErr);
        throw new Error(`JSON 파싱 실패: ${text}`);
      }
    }
    // 최종적으로 클라이언트에 JSON 응답 반환
    return NextResponse.json(result);
  } catch (e) {
    // 전체 try 블록 실패 시 에러 로그와 함께 500 응답 반환
    console.error('[닉네임 중복 확인 에러]', e);
    return NextResponse.json(
      { error: '중복 확인 중 오류 발생' },
      { status: 500 }
    );
  }
}
