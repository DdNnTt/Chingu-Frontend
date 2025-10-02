import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

const dailyProfileUploads = new Map<string, string>();

async function checkDailyProfileUpload(
  userId: string,
  date: string
): Promise<boolean> {
  const key = `daily_profile_upload_${userId}_${date}`;
  return dailyProfileUploads.has(key);
}

async function recordDailyProfileUpload(
  userId: string,
  date: string
): Promise<void> {
  const key = `daily_profile_upload_${userId}_${date}`;
  dailyProfileUploads.set(key, date);
}

export async function PATCH(req: NextRequest) {
  const token = req.headers.get('authorization');
  const API_BASE = process.env.API_BASE_URL;

  if (!API_BASE) {
    return NextResponse.json({ message: 'API 주소 누락' }, { status: 500 });
  }

  const body = await req.json();
  console.log('[프록시 PATCH 요청]', body);

  // 프로필 이미지 업로드인 경우 일일 제한 체크
  if (body.profilePictureUrl && body.profilePictureUrl !== '') {
    // 토큰에서 사용자 ID 추출
    try {
      const payload = JSON.parse(atob(token?.split('.')[1] || ''));
      const userId = payload.userId || payload.sub;
      const today = new Date().toISOString().split('T')[0];

      if (userId) {
        const hasUploadedToday = await checkDailyProfileUpload(userId, today);
        if (hasUploadedToday) {
          return NextResponse.json(
            {
              message: '하루에 1개의 프로필 이미지만 업로드할 수 있습니다.',
              error: 'DAILY_PROFILE_UPLOAD_LIMIT_EXCEEDED',
            },
            { status: 429 }
          );
        }
      }
    } catch (error) {
      console.warn('[토큰 파싱 실패] 프로필 업로드 제한 체크 건너뜀:', error);
    }
  }

  try {
    const res = await fetch(`${API_BASE}/api/users/mypage/edit`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: token ?? '',
      },
      body: JSON.stringify(body),
    });

    const text = await res.text();
    try {
      const data = JSON.parse(text);

      // 프로필 이미지 업로드 성공 시 서버에 기록
      if (
        res.status === 200 &&
        body.profilePictureUrl &&
        body.profilePictureUrl !== ''
      ) {
        try {
          const payload = JSON.parse(atob(token?.split('.')[1] || ''));
          const userId = payload.userId || payload.sub;
          const today = new Date().toISOString().split('T')[0];

          if (userId) {
            await recordDailyProfileUpload(userId, today);
            console.log(
              `[프로필 이미지 업로드 성공] 사용자 ${userId}의 일일 업로드 기록됨`
            );
          }
        } catch (error) {
          console.warn('[토큰 파싱 실패] 프로필 업로드 기록 건너뜀:', error);
        }
      }

      return NextResponse.json(data, { status: res.status });
    } catch {
      return NextResponse.json({ message: text }, { status: res.status });
    }
  } catch (err) {
    console.error('[프록시 PATCH 오류]', err);
    return NextResponse.json({ message: '서버 오류' }, { status: 500 });
  }
}
