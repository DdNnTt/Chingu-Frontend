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
        setIsLoading(true);
        const response = await axiosInstance.get(`/api/quizzes/${quizId}`);
        setQuizSet(response.data);

        // 선택된 답변 배열 초기화
        setSelectedAnswers(new Array(response.data.questions.length).fill(-1));
      } catch (err) {
        console.error('퀴즈 로드 실패:', err);
        setError('퀴즈를 불러오는데 실패했습니다.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchQuiz();
  }, [quizId]);

  // 답변 선택
  const handleAnswerSelect = (answerIndex: number) => {
    const newAnswers = [...selectedAnswers];
    newAnswers[currentQuestionIndex] = answerIndex;
    setSelectedAnswers(newAnswers);
  };

  // 다음 문제로
  const handleNext = () => {
    if (currentQuestionIndex < (quizSet?.questions.length || 0) - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  // 이전 문제로
  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  // 퀴즈 제출
  const handleSubmit = async () => {
    if (!quizSet || selectedAnswers.includes(-1)) {
      alert('모든 문제에 답변해주세요!');
      return;
    }

    try {
      setIsSubmitting(true);

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
      <div className="my-home-page py-4 px-4 pt-10 pb-10 mx-auto rounded-lg bg-gray-100 overflow-y-auto">
        <div className="max-w-4xl mx-auto text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">퀴즈를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="my-home-page py-4 px-4 pt-10 pb-10 mx-auto rounded-lg bg-gray-100 overflow-y-auto">
        <div className="max-w-4xl mx-auto text-center py-8">
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
    );
  }

  if (!quizSet) {
    return (
      <div className="my-home-page py-4 px-4 pt-10 pb-10 mx-auto rounded-lg bg-gray-100 overflow-y-auto">
        <div className="max-w-4xl mx-auto text-center py-8">
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
    );
  }

  if (quizResult) {
    return (
      <div className="my-home-page py-4 px-4 pt-10 pb-10 mx-auto rounded-lg bg-gray-100 overflow-y-auto">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              퀴즈 완료!
            </h1>
            <p className="text-gray-600">결과를 확인해보세요</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md mb-6">
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">
                  {quizResult.totalCorrect}
                </div>
                <div className="text-sm text-gray-600">정답 수</div>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">
                  {quizResult.totalScore}
                </div>
                <div className="text-sm text-gray-600">총점</div>
              </div>
            </div>

            <div className="space-y-3">
              {quizResult.results.map((result, index: number) => (
                <div
                  key={index}
                  className={`p-3 rounded-lg border ${
                    result.correct
                      ? 'bg-green-50 border-green-200'
                      : 'bg-red-50 border-red-200'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium">
                      문제 {index + 1}: {quizSet.questions[index].content}
                    </span>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
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

          <div className="flex gap-4 justify-center">
            <Button
              type="button"
              onClick={() => router.back()}
              className="bg-blue-600 text-white"
            >
              뒤로 가기
            </Button>
            <Button
              type="button"
              onClick={() => router.push('/front/my-home')}
              className="bg-green-600 text-white"
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
    <div className="my-home-page py-4 px-4 pt-10 pb-10 mx-auto rounded-lg bg-gray-100 overflow-y-auto">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            {quizSet.creatorNickname}의 퀴즈
          </h1>
          <p className="text-gray-600">
            문제 {currentQuestionIndex + 1} / {quizSet.questions.length}
          </p>
        </div>

        {/* 진행률 바 */}
        <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>

        {/* 문제 */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
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
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <span className="font-medium text-gray-800">
                  {String.fromCharCode(65 + index)}. {option}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* 네비게이션 버튼 */}
        <div className="flex justify-between">
          <Button
            type="button"
            onClick={handlePrevious}
            disabled={currentQuestionIndex === 0}
            className="bg-gray-500 text-white disabled:opacity-50"
          >
            이전
          </Button>

          {currentQuestionIndex === quizSet.questions.length - 1 ? (
            <Button
              type="button"
              onClick={handleSubmit}
              disabled={selectedAnswers.includes(-1) || isSubmitting}
              className="bg-green-600 text-white disabled:opacity-50"
            >
              {isSubmitting ? '제출 중...' : '퀴즈 완료'}
            </Button>
          ) : (
            <Button
              type="button"
              onClick={handleNext}
              disabled={selectedAnswers[currentQuestionIndex] === -1}
              className="bg-blue-600 text-white disabled:opacity-50"
            >
              다음
            </Button>
          )}
        </div>

        {/* 답변 현황 */}
        <div className="mt-6 bg-white p-4 rounded-lg shadow-sm">
          <h3 className="font-semibold mb-3">답변 현황</h3>
          <div className="grid grid-cols-5 gap-2">
            {selectedAnswers.map((answer, index) => (
              <div
                key={index}
                className={`p-2 text-center rounded text-sm font-medium ${
                  answer === -1
                    ? 'bg-gray-100 text-gray-500'
                    : 'bg-blue-100 text-blue-800'
                }`}
              >
                {index + 1}
              </div>
            ))}
          </div>
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
