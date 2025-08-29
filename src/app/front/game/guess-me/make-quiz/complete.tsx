'use client';

import { useRouter } from 'next/navigation';
import Button from '@/components/common/Button';

export default function QuizComplete() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-8 px-4">
      <div className="max-w-md mx-auto text-center">
        <div className="bg-white p-8 rounded-lg shadow-md">
          {/* 성공 아이콘 */}
          <div className="text-6xl mb-6">🎉</div>

          {/* 제목 */}
          <h1 className="text-2xl font-bold text-gray-800 mb-4">
            퀴즈 만들기 완료!
          </h1>

          {/* 설명 */}
          <p className="text-gray-600 mb-6">
            친구들이 나에 대해 얼마나 알고 있는지 테스트할 수 있는 퀴즈가
            성공적으로 만들어졌습니다.
          </p>

          {/* 다음 단계 안내 */}
          <div className="bg-blue-50 p-4 rounded-lg mb-6 text-left">
            <h3 className="font-semibold text-blue-800 mb-2">다음 단계:</h3>
            <ul className="text-blue-700 text-sm space-y-1">
              <li>• 친구들에게 퀴즈 링크를 공유하세요</li>
              <li>• 친구들의 답변을 확인해보세요</li>
              <li>• 우정 점수를 확인해보세요</li>
            </ul>
          </div>

          {/* 버튼들 */}
          <div className="space-y-3">
            <Button
              onClick={() => router.push('/front/my-home')}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3"
            >
              마이홈으로 돌아가기
            </Button>

            <Button
              onClick={() => router.push('/front/game/guess-me/make-quiz')}
              className="w-full bg-green-600 hover:bg-green-700 text-white py-3"
            >
              퀴즈 더 만들기
            </Button>

            <Button
              onClick={() => router.push('/front/game/guess-me')}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3"
            >
              게임 메인으로
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
