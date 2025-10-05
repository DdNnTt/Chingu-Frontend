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
    const reqBody = await req.json();
    const { requestId, status } = reqBody;

    console.log('[초대 응답 요청]', { requestId, status });

    const url = `${API_BASE}/api/groups/invites/${requestId}`;
    const headers = {
      'Content-Type': 'application/json',
      Authorization: token,
    };
    const body = JSON.stringify({ status });

    const attempts = [
      () => fetch(url, { method: 'PATCH', headers, body }),
      () => fetch(url, { method: 'PUT', headers, body }),
      () =>
        fetch(`${url}?action=${status.toLowerCase()}`, {
          method: 'GET',
          headers,
        }),
    ];

    let res: Response | undefined;
    for (const attempt of attempts) {
      res = await attempt();
      console.log('[초대 응답 결과]', res.status, res.statusText);
      if (res.ok) break;
    }

    if (!res) {
      throw new Error('초대 응답 요청을 보내지 못했습니다.');
    }

    const data = await res.json().catch(() => null);
    if (!res.ok) {
      return NextResponse.json(
        data ?? { message: '초대 응답 처리에 실패했습니다.' },
        { status: res.status }
      );
    }

    return NextResponse.json(data, { status: res.status });
  } catch (error) {
    console.error('[초대 응답 오류]', error);
    return NextResponse.json(
      { message: '초대 응답 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
