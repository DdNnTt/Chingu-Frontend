'use client';

import Link from 'next/link';
import Button from '@/components/common/Button';

export default function QuizComplete() {
  return (
    <div className="my-home-page py-4 px-4 pt-20 pb-28 mx-auto rounded-lg bg-gray-100 overflow-y-auto">
      {/* 뒤로가기 버튼과 타이틀 */}
      <div className="relative mb-6 min-h-[40px] flex items-center justify-center">
        <h1 className="text-2xl font-semibold text-center w-full">
          퀴즈 만들기 완료!
        </h1>
      </div>

      {/* 성공 메시지 카드 */}
      <div className="bg-white p-6 rounded-lg shadow-sm mb-4">
        <div className="text-center">
          <div className="text-6xl mb-4">🎉</div>
          <h2 className="text-xl font-bold text-gray-800 mb-4">
            퀴즈가 성공적으로 만들어졌습니다!
          </h2>
          <p className="text-gray-600 mb-6">
            친구들이 나에 대해 얼마나 알고 있는지
            <br /> 테스트할 수 있는 퀴즈가 완성되었습니다.
          </p>
        </div>
      </div>

      {/* 다음 단계 안내 */}
      <div className="bg-white p-6 rounded-lg shadow-sm mb-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">다음 단계</h3>
        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">
              1
            </div>
            <p className="text-gray-700">친구들에게 퀴즈 링크를 공유하세요</p>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">
              2
            </div>
            <p className="text-gray-700">친구들의 답변을 확인해보세요</p>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">
              3
            </div>
            <p className="text-gray-700">우정 점수를 확인해보세요</p>
          </div>
        </div>
      </div>

      {/* 액션 버튼 */}
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <div className="space-y-3">
          <Link href="/front/my-home" className="block">
            <Button className="w-full bg-blue-600 text-white py-3">
              마이홈으로 돌아가기
            </Button>
          </Link>

          <Link href="/front/game/guess-me/make-quiz" className="block">
            <Button className="w-full bg-green-600 text-white py-3">
              퀴즈 더 만들기
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
