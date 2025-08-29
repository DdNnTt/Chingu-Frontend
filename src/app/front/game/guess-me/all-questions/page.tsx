'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Button from '@/components/common/Button';
import axiosInstance from '@/libs/axios';

interface Question {
  id: number;
  content: string;
  option1: string;
  option2: string;
  option3: string;
  option4: string;
}

export default function AllQuestionsPage() {
  const router = useRouter();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 전체 문제 조회
  const fetchAllQuestions = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await axiosInstance.get('/api/quizzes/question-all');
      setQuestions(response.data);
    } catch (err) {
      console.error('전체 문제 조회 실패:', err);
      setError('문제를 불러오는데 실패했습니다.');
      setQuestions([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAllQuestions();
  }, []);

  const handleGoBack = () => {
    router.back();
  };

  const handleRefresh = () => {
    fetchAllQuestions();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="text-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
            <p className="mt-4 text-gray-600 text-lg">
              전체 문제를 불러오는 중...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="text-center py-20">
            <div className="text-red-500 text-6xl mb-4">⚠️</div>
            <h1 className="text-2xl font-bold text-gray-800 mb-4">
              문제 로드 실패
            </h1>
            <p className="text-gray-600 mb-6">{error}</p>
            <div className="space-x-4">
              <Button
                onClick={handleRefresh}
                className="bg-indigo-600 text-white px-6 py-3"
              >
                다시 시도
              </Button>
              <Button
                onClick={handleGoBack}
                className="bg-gray-600 text-white px-6 py-3"
              >
                뒤로 가기
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20 pb-20">
      <div className="max-w-4xl mx-auto px-4 py-8 overflow-y-auto max-h-screen">
        {/* 헤더 */}
        <div className="mb-8">
          {/* 뒤로 가기 버튼과 제목을 한 줄로 */}
          <div className="flex items-center justify-between mb-6">
            <Button
              variant="secondary"
              onClick={handleGoBack}
              className="px-4 py-2 text-sm"
            >
              ← 뒤로 가기
            </Button>

            <h1 className="text-3xl font-bold text-gray-800">전체 문제 목록</h1>

            {/* 오른쪽 공간을 위한 빈 div (균형 맞추기) */}
            <div className="w-24"></div>
          </div>

          {/* 설명 */}
          <div className="text-center mb-6">
            <p className="text-gray-600">
              총 {questions.length}개의 문제가 있습니다
            </p>
          </div>
        </div>

        {/* 문제 목록 */}
        <div className="space-y-6 pb-8">
          {questions.map((question, index) => (
            <div
              key={question.id}
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
            >
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center">
                  <span className="text-indigo-600 font-bold text-lg">
                    {index + 1}
                  </span>
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">
                    {question.content}
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                      <span className="font-bold text-blue-600 mr-2">A.</span>
                      {question.option1}
                    </div>
                    <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                      <span className="font-bold text-green-600 mr-2">B.</span>
                      {question.option2}
                    </div>
                    <div className="p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                      <span className="font-bold text-yellow-600 mr-2">C.</span>
                      {question.option3}
                    </div>
                    <div className="p-3 bg-purple-50 rounded-lg border border-purple-200">
                      <span className="font-bold text-purple-600 mr-2">D.</span>
                      {question.option4}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* 하단 정보 */}
        <div className="mt-12 text-center text-gray-500">
          <p className="text-sm">
            이 문제들을 활용해서 친구들과 재미있는 퀴즈를 만들어보세요! 🎉
          </p>
        </div>
      </div>
    </div>
  );
}
