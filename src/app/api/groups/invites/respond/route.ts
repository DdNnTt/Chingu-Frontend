import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const API_BASE = process.env.API_BASE_URL;
  const token = req.headers.get('authorization');

  if (!token) {
    return NextResponse.json(
      { message: '인증 토큰이 필요합니다.' },
      { status: 401 }
    );
  }

  try {
    const body = await req.json();
    const { requestId, status } = body;

    console.log('[초대 응답 요청]', { requestId, status });

    // 여러 가능한 API 패턴 시도
    let res;

    // 패턴 1: PATCH 메서드로 요청 ID를 경로에 포함
    try {
      console.log(
        '[패턴 1 시도] PATCH',
        `${API_BASE}/api/groups/invites/${requestId}`
      );
      res = await fetch(`${API_BASE}/api/groups/invites/${requestId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token,
        },
        body: JSON.stringify({
          status, // 'ACCEPTED' 또는 'REJECTED'
        }),
      });
      console.log('[패턴 1 응답]', res.status, res.statusText);
    } catch (error) {
      console.log('[패턴 1 실패]', error);
      try {
        // 패턴 2: PUT 메서드로 요청 ID를 경로에 포함
        console.log(
          '[패턴 2 시도] PUT',
          `${API_BASE}/api/groups/invites/${requestId}`
        );
        res = await fetch(`${API_BASE}/api/groups/invites/${requestId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: token,
          },
          body: JSON.stringify({
            status, // 'ACCEPTED' 또는 'REJECTED'
          }),
        });
        console.log('[패턴 2 응답]', res.status, res.statusText);
      } catch (error2) {
        console.log('[패턴 2 실패]', error2);
        // 패턴 3: GET 메서드로 쿼리 파라미터 사용
        console.log(
          '[패턴 3 시도] GET',
          `${API_BASE}/api/groups/invites/${requestId}?action=${status.toLowerCase()}`
        );
        res = await fetch(
          `${API_BASE}/api/groups/invites/${requestId}?action=${status.toLowerCase()}`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              Authorization: token,
            },
          }
        );
        console.log('[패턴 3 응답]', res.status, res.statusText);
      }
    }

    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (error) {
    console.error('[초대 응답 오류]', error);
    return NextResponse.json(
      { message: '초대 응답 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
