'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Button from '@/components/common/Button';
import axiosInstance from '@/libs/axios';

interface Question {
  questionId: number;
  content: string;
  option1: string;
  option2: string;
  option3: string;
  option4: string;
}

interface QuizSet {
  quizSetId: number;
  creatorNickname: string;
  questions: Question[];
}

function SolveQuizContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const quizId = searchParams.get('quizId');

  const [quizSet, setQuizSet] = useState<QuizSet | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [quizResult, setQuizResult] = useState<{
    totalCorrect: number;
    totalScore: number;
    results: Array<{
      correct: boolean;
    }>;
  } | null>(null);

  // 퀴즈 데이터 로드
  useEffect(() => {
    if (!quizId) {
      setError('퀴즈 ID가 없습니다.');
      return;
    }

    const fetchQuiz = async () => {
      try {
        const response = await axiosInstance.get(`/api/quizzes/${quizId}`);
        setQuizSet(response.data);
        setSelectedAnswers(new Array(response.data.questions.length).fill(-1));
      } catch (err) {
        console.error('퀴즈 로드 실패:', err);
        setError('퀴즈를 불러올 수 없습니다.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchQuiz();
  }, [quizId]);

  const handleAnswerSelect = (answerIndex: number) => {
    const newAnswers = [...selectedAnswers];
    newAnswers[currentQuestionIndex] = answerIndex;
    setSelectedAnswers(newAnswers);
  };

  const handleNext = () => {
    if (currentQuestionIndex < quizSet!.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleSubmit = async () => {
    if (!quizSet) return;

    setIsSubmitting(true);
    try {
      const response = await axiosInstance.post('/api/quizzes/solve', {
        solverNickname: '테스트 사용자', // TODO: 실제 사용자 닉네임으로 변경
        quizSetId: quizSet.quizSetId,
        answers: selectedAnswers.map((answer, index) => ({
          questionId: quizSet.questions[index].questionId,
          selectedOption: answer,
        })),
      });

      setQuizResult(response.data);
    } catch (err) {
      console.error('퀴즈 제출 실패:', err);
      alert('퀴즈 제출에 실패했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="my-home-page py-4 px-4 pt-20 pb-28 mx-auto rounded-lg bg-gray-100 overflow-y-auto">
        <div className="relative mb-6 min-h-[40px] flex items-center justify-center">
          <h1 className="text-2xl font-semibold text-center w-full">
            퀴즈 풀이
          </h1>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">⏳</div>
            <p className="text-gray-600">퀴즈를 불러오는 중...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="my-home-page py-4 px-4 pt-20 pb-28 mx-auto rounded-lg bg-gray-100 overflow-y-auto">
        <div className="relative mb-6 min-h-[40px] flex items-center justify-center">
          <button
            onClick={() => router.back()}
            className="px-4 py-3 rounded-lg transition-colors bg-gray-200 text-gray-700 absolute left-0 top-1/2 -translate-y-1/2 px-3 py-1 text-sm"
          >
            ← 뒤로
          </button>
          <h1 className="text-2xl font-semibold text-center w-full">
            퀴즈 풀이
          </h1>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="text-center py-12">
            <div className="text-red-400 text-6xl mb-4">❌</div>
            <p className="text-red-600 mb-4">{error}</p>
            <Button
              type="button"
              onClick={() => router.back()}
              className="bg-blue-600 text-white"
            >
              뒤로 가기
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (!quizSet) {
    return (
      <div className="my-home-page py-4 px-4 pt-20 pb-28 mx-auto rounded-lg bg-gray-100 overflow-y-auto">
        <div className="relative mb-6 min-h-[40px] flex items-center justify-center">
          <button
            onClick={() => router.back()}
            className="px-4 py-3 rounded-lg transition-colors bg-gray-200 text-gray-700 absolute left-0 top-1/2 -translate-y-1/2 px-3 py-1 text-sm"
          >
            ← 뒤로
          </button>
          <h1 className="text-2xl font-semibold text-center w-full">
            퀴즈 풀이
          </h1>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">🔍</div>
            <p className="text-gray-600 mb-4">퀴즈를 찾을 수 없습니다.</p>
            <Button
              type="button"
              onClick={() => router.back()}
              className="bg-blue-600 text-white"
            >
              뒤로 가기
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (quizResult) {
    return (
      <div className="my-home-page py-4 px-4 pt-20 pb-28 mx-auto rounded-lg bg-gray-100 overflow-y-auto">
        <div className="relative mb-6 min-h-[40px] flex items-center justify-center">
          <button
            onClick={() => router.back()}
            className="px-4 py-3 rounded-lg transition-colors bg-gray-200 text-gray-700 absolute left-0 top-1/2 -translate-y-1/2 px-3 py-1 text-sm"
          >
            ← 뒤로
          </button>
          <h1 className="text-2xl font-semibold text-center w-full">
            퀴즈 완료!
          </h1>
        </div>

        {/* 결과 카드 */}
        <div className="bg-white p-6 rounded-lg shadow-sm mb-4">
          <div className="text-center mb-6">
            <div className="text-6xl mb-4">🎉</div>
            <h2 className="text-xl font-bold text-gray-800 mb-2">
              퀴즈를 완료했습니다!
            </h2>
            <p className="text-gray-600">결과를 확인해보세요</p>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-3xl font-bold text-blue-600 mb-1">
                {quizResult.totalCorrect}
              </div>
              <div className="text-sm text-gray-600">정답 수</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-3xl font-bold text-green-600 mb-1">
                {quizResult.totalScore}
              </div>
              <div className="text-sm text-gray-600">총점</div>
            </div>
          </div>
        </div>

        {/* 문제별 결과 */}
        <div className="bg-white p-6 rounded-lg shadow-sm mb-4">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            문제별 결과
          </h3>
          <div className="space-y-3">
            {quizResult.results.map((result, index: number) => (
              <div
                key={index}
                className={`p-4 rounded-lg border-2 ${
                  result.correct
                    ? 'bg-green-50 border-green-200'
                    : 'bg-red-50 border-red-200'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium text-gray-800">
                    문제 {index + 1}: {quizSet.questions[index].content}
                  </span>
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      result.correct
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {result.correct ? '정답' : '오답'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 액션 버튼 */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex gap-3">
            <Button
              type="button"
              onClick={() => router.back()}
              className="flex-1 bg-gray-600 text-white"
            >
              뒤로 가기
            </Button>
            <Button
              type="button"
              onClick={() => router.push('/front/my-home')}
              className="flex-1 bg-blue-600 text-white"
            >
              홈으로
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const currentQuestion = quizSet.questions[currentQuestionIndex];
  const progress =
    ((currentQuestionIndex + 1) / quizSet.questions.length) * 100;

  return (
    <div className="my-home-page py-4 px-4 pt-20 pb-28 mx-auto rounded-lg bg-gray-100 overflow-y-auto">
      <div className="relative mb-6 min-h-[40px] flex items-center justify-center">
        <button
          onClick={() => router.back()}
          className="px-4 py-3 rounded-lg transition-colors bg-gray-200 text-gray-700 absolute left-0 top-1/2 -translate-y-1/2 px-3 py-1 text-sm"
        >
          ← 뒤로
        </button>
        <h1 className="text-2xl font-semibold text-center w-full">
          {quizSet.creatorNickname}의 퀴즈
        </h1>
      </div>

      {/* 진행률 바 */}
      <div className="bg-white p-4 rounded-lg shadow-sm mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700">
            문제 {currentQuestionIndex + 1} / {quizSet.questions.length}
          </span>
          <span className="text-sm text-gray-500">{Math.round(progress)}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div
            className="bg-blue-600 h-3 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>

      {/* 문제 카드 */}
      <div className="bg-white p-6 rounded-lg shadow-sm mb-4">
        <h2 className="text-xl font-semibold mb-6 text-gray-800">
          {currentQuestion.content}
        </h2>

        <div className="space-y-3">
          {[
            currentQuestion.option1,
            currentQuestion.option2,
            currentQuestion.option3,
            currentQuestion.option4,
          ].map((option, index) => (
            <button
              key={index}
              onClick={() => handleAnswerSelect(index)}
              className={`w-full p-4 text-left rounded-lg border-2 transition-all duration-200 ${
                selectedAnswers[currentQuestionIndex] === index
                  ? 'border-blue-500 bg-blue-50 text-blue-800'
                  : 'border-gray-200 hover:border-gray-300 text-gray-700'
              }`}
            >
              <span className="font-medium">
                {String.fromCharCode(65 + index)}. {option}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* 답변 현황 */}
      <div className="bg-white p-4 rounded-lg shadow-sm mb-4">
        <h3 className="font-semibold mb-3 text-gray-800">답변 현황</h3>
        <div className="grid grid-cols-5 gap-2">
          {selectedAnswers.map((answer, index) => (
            <div
              key={index}
              className={`p-3 text-center rounded-lg text-sm font-medium ${
                answer === -1
                  ? 'bg-gray-100 text-gray-500'
                  : 'bg-blue-100 text-blue-800'
              } ${index === currentQuestionIndex ? 'ring-2 ring-blue-500' : ''}`}
            >
              {index + 1}
            </div>
          ))}
        </div>
      </div>

      {/* 네비게이션 버튼 */}
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <div className="flex justify-between gap-3">
          <Button
            type="button"
            onClick={handlePrevious}
            disabled={currentQuestionIndex === 0}
            className="bg-gray-500 text-white disabled:opacity-50 flex-1"
          >
            이전
          </Button>

          {currentQuestionIndex === quizSet.questions.length - 1 ? (
            <Button
              type="button"
              onClick={handleSubmit}
              disabled={selectedAnswers.includes(-1) || isSubmitting}
              className="bg-green-600 text-white disabled:opacity-50 flex-1"
            >
              {isSubmitting ? '제출 중...' : '퀴즈 완료'}
            </Button>
          ) : (
            <Button
              type="button"
              onClick={handleNext}
              disabled={selectedAnswers[currentQuestionIndex] === -1}
              className="bg-blue-600 text-white disabled:opacity-50 flex-1"
            >
              다음
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

export default function SolveQuizPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SolveQuizContent />
    </Suspense>
  );
}
