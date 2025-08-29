'use client';

import { useState } from 'react';
import Button from '@/components/common/Button';
import Input from '@/components/common/Input';
import { useRouter } from 'next/navigation';

interface Question {
  content: string;
  option1: string;
  option2: string;
  option3: string;
  option4: string;
  selectedAnswer: number;
}

export default function GameMakeQuiz() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState<Question>({
    content: '',
    option1: '',
    option2: '',
    option3: '',
    option4: '',
    selectedAnswer: 1,
  });
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  // 문제 추가
  const addQuestion = () => {
    if (
      currentQuestion.content &&
      currentQuestion.option1 &&
      currentQuestion.option2 &&
      currentQuestion.option3 &&
      currentQuestion.option4
    ) {
      setQuestions([...questions, currentQuestion]);
      setCurrentQuestion({
        content: '',
        option1: '',
        option2: '',
        option3: '',
        option4: '',
        selectedAnswer: 1,
      });
    }
  };

  // 문제 삭제
  const removeQuestion = (index: number) => {
    setQuestions(questions.filter((_, i) => i !== index));
  };

  // 퀴즈 저장
  const saveQuiz = async () => {
    if (questions.length === 0) {
      alert('최소 1개 이상의 문제를 추가해주세요.');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('/api/quizzes/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          questions: questions.map((q, index) => ({
            questionId: index + 1,
            selectedAnswer: q.selectedAnswer,
          })),
        }),
      });

      if (response.ok) {
        await response.json();
        alert('퀴즈가 성공적으로 저장되었습니다!');
        router.push('/front/game/guess-me/make-quiz/complete');
      } else {
        alert('퀴즈 저장에 실패했습니다.');
      }
    } catch (error) {
      console.error('퀴즈 저장 실패:', error);
      alert('퀴즈 저장 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="my-home-page py-4 px-4 pt-20 pb-20 mx-auto rounded-lg bg-gray-100 overflow-y-auto">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            나를 맞춰봐 문제 만들기
          </h1>
          <p className="text-gray-600">
            친구들이 나에 대해 얼마나 알고 있는지 테스트해보세요!
          </p>
        </div>

        {/* 문제 입력 폼 */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">
            새 문제 추가
          </h2>

          <div className="space-y-4">
            <Input
              label="문제 내용"
              value={currentQuestion.content}
              onChange={(e) =>
                setCurrentQuestion({
                  ...currentQuestion,
                  content: e.target.value,
                })
              }
              placeholder="예: 내가 가장 좋아하는 음식은?"
              required
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="보기 1"
                value={currentQuestion.option1}
                onChange={(e) =>
                  setCurrentQuestion({
                    ...currentQuestion,
                    option1: e.target.value,
                  })
                }
                placeholder="첫 번째 보기"
                required
              />
              <Input
                label="보기 2"
                value={currentQuestion.option2}
                onChange={(e) =>
                  setCurrentQuestion({
                    ...currentQuestion,
                    option2: e.target.value,
                  })
                }
                placeholder="두 번째 보기"
                required
              />
              <Input
                label="보기 3"
                value={currentQuestion.option3}
                onChange={(e) =>
                  setCurrentQuestion({
                    ...currentQuestion,
                    option3: e.target.value,
                  })
                }
                placeholder="세 번째 보기"
                required
              />
              <Input
                label="보기 4"
                value={currentQuestion.option4}
                onChange={(e) =>
                  setCurrentQuestion({
                    ...currentQuestion,
                    option4: e.target.value,
                  })
                }
                placeholder="네 번째 보기"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700">
                정답
              </label>
              <select
                value={currentQuestion.selectedAnswer}
                onChange={(e) =>
                  setCurrentQuestion({
                    ...currentQuestion,
                    selectedAnswer: parseInt(e.target.value),
                  })
                }
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value={1}>보기 1</option>
                <option value={2}>보기 2</option>
                <option value={3}>보기 3</option>
                <option value={4}>보기 4</option>
              </select>
            </div>

            <Button
              onClick={addQuestion}
              className="w-full bg-blue-600 text-white py-3"
              disabled={
                !currentQuestion.content ||
                !currentQuestion.option1 ||
                !currentQuestion.option2 ||
                !currentQuestion.option3 ||
                !currentQuestion.option4
              }
            >
              문제 추가하기
            </Button>
          </div>
        </div>

        {/* 추가된 문제 목록 */}
        {questions.length > 0 && (
          <div className="bg-white p-6 rounded-lg shadow-md mb-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-800">
                추가된 문제 ({questions.length}개)
              </h2>
              <span className="text-sm text-gray-500">
                최소 1개 이상의 문제가 필요합니다
              </span>
            </div>

            <div className="space-y-4">
              {questions.map((question, index) => (
                <div
                  key={index}
                  className="border border-gray-200 p-4 rounded-lg bg-gray-50"
                >
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-medium text-gray-800">
                      문제 {index + 1}
                    </h3>
                    <button
                      onClick={() => removeQuestion(index)}
                      className="text-red-500 text-sm font-medium"
                    >
                      삭제
                    </button>
                  </div>
                  <p className="text-gray-700 mb-3 text-lg">
                    {question.content}
                  </p>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div
                      className={`p-2 rounded ${question.selectedAnswer === 1 ? 'bg-green-100 text-green-800' : 'bg-gray-100'}`}
                    >
                      보기 1: {question.option1}
                    </div>
                    <div
                      className={`p-2 rounded ${question.selectedAnswer === 2 ? 'bg-green-100 text-green-800' : 'bg-gray-100'}`}
                    >
                      보기 2: {question.option2}
                    </div>
                    <div
                      className={`p-2 rounded ${question.selectedAnswer === 3 ? 'bg-green-100 text-green-800' : 'bg-gray-100'}`}
                    >
                      보기 3: {question.option3}
                    </div>
                    <div
                      className={`p-2 rounded ${question.selectedAnswer === 4 ? 'bg-green-100 text-green-800' : 'bg-gray-100'}`}
                    >
                      보기 4: {question.option4}
                    </div>
                  </div>
                  <p className="text-green-600 font-medium mt-3 text-center">
                    ✅ 정답: 보기 {question.selectedAnswer}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-6 space-y-3">
              <Button
                onClick={saveQuiz}
                className="w-full bg-green-600 text-white py-3"
                disabled={isLoading}
              >
                {isLoading ? '저장 중...' : '퀴즈 저장하기'}
              </Button>

              <Button
                onClick={() => router.push('/front/my-home')}
                className="w-full bg-gray-500 text-white py-3"
              >
                마이홈으로 돌아가기
              </Button>
            </div>
          </div>
        )}

        {/* 문제가 없을 때 안내 */}
        {questions.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">📝</div>
            <p className="text-gray-600 mb-2">아직 문제가 없습니다</p>
            <p className="text-gray-500 text-sm">
              위의 폼을 사용해서 첫 번째 문제를 만들어보세요!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
