import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const API_BASE = process.env.API_BASE_URL;
  const token = req.headers.get('authorization');

  if (!API_BASE) {
    return NextResponse.json({ error: 'API_BASE_URL 누락됨' }, { status: 500 });
  }

  try {
    const res = await fetch(`${API_BASE}/api/friends`, {
      method: 'GET',
      headers: {
        Authorization: token || '',
      },
    });

    if (!res.ok) {
      const errorText = await res.text(); // 에러 응답 원문 확인
      console.error('[친구 목록 응답 실패]', res.status, errorText);
      return NextResponse.json(
        { error: '친구 목록 조회 실패', status: res.status },
        { status: res.status }
      );
    }

    const text = await res.text(); // 원문 먼저 받기
    if (!text) {
      console.warn('[친구 목록 응답 본문 없음]');
      return NextResponse.json([], { status: 200 }); // 빈 배열 반환 (UI에 영향 X)
    }

    const data = JSON.parse(text);
    return NextResponse.json(data);
  } catch (err) {
    console.error('[친구 목록 프록시 오류]', err);
    return NextResponse.json({ error: '서버 오류' }, { status: 500 });
  }
}
