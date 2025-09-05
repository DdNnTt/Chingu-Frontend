'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import axios from '@/libs/axios';
import { isAxiosError } from 'axios';
import Button from '@/components/common/Button';

interface Message {
  messageId: number;
  sender: string;
  receiver: string;
  content: string;
  sendTime: string;
  readStatus: boolean;
  senderDeleted: boolean;
  receiverDeleted: boolean;
}

export default function MessageDetail() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const messageId = searchParams.get('id');
  const [message, setMessage] = useState<Message | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMessage = async () => {
      if (!messageId) {
        setError('쪽지 ID가 없습니다.');
        setIsLoading(false);
        return;
      }

      try {
        const response = await axios.get(`/api/messages/read/${messageId}`);
        setMessage(response.data);

        try {
          await axios.patch(`/api/messages/read/${messageId}`);
        } catch {
          // 읽음 처리 실패는 사용자에게 알리지 않음
        }
      } catch (err: unknown) {
        let errorMessage = '쪽지를 불러오지 못했습니다.';

        if (isAxiosError(err)) {
          if (
            err.response?.status === 500 &&
            err.response?.data?.message ===
              '해당 쪽지에 대한 접근 권한이 없습니다.'
          ) {
            errorMessage = '이 쪽지에 대한 접근 권한이 없습니다.';
          } else {
            errorMessage =
              (err.response?.data as { message?: string })?.message ||
              errorMessage;
          }
        } else if (err instanceof Error) {
          errorMessage = err.message;
        }

        setError(errorMessage);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMessage();
  }, [messageId]);

  const handleDelete = async () => {
    if (!messageId) return;

    const isConfirmed = confirm('쪽지를 삭제하시겠습니까?');

    if (isConfirmed) {
      try {
        await axios.delete(`/api/messages/${messageId}`);
        alert('쪽지가 삭제되었습니다.');
        router.push('/front/message/list');
      } catch {
        alert('쪽지 삭제에 실패했습니다.');
      }
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col bg-gray-100 overflow-hidden pt-20">
        <div className="bg-white p-4 flex items-center border-b">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            뒤로
          </button>
          <h1 className="text-center flex-1 font-semibold">쪽지 상세</h1>
          <div className="w-10"></div>
        </div>
        <div className="flex-1 p-4 flex items-center justify-center">
          <div className="text-gray-500">쪽지를 불러오는 중...</div>
        </div>
      </div>
    );
  }

  if (error || !message) {
    return (
      <div className="flex flex-col bg-gray-100 overflow-hidden pt-20">
        <div className="bg-white p-4 flex items-center border-b">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            뒤로
          </button>
          <h1 className="text-center flex-1 font-semibold">쪽지 상세</h1>
          <div className="w-10"></div>
        </div>
        <div className="flex-1 p-4 flex items-center justify-center">
          <div className="text-red-500">
            {error || '쪽지를 찾을 수 없습니다.'}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col bg-gray-100 overflow-hidden pt-20 pb-20">
      <div className="p-4 flex items-center border-b">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          뒤로
        </button>
        <h1 className="text-center flex-1 font-semibold">
          보낸 사람: {message.sender}
        </h1>
        <div className="w-10"></div>
      </div>

      <div className="flex-1 p-4">
        <div className="bg-white rounded-lg p-4 min-h-[200px]">
          <div className="text-sm text-gray-400 mb-2">
            {new Date(message.sendTime).toLocaleString()}
          </div>
          <div className="text-gray-800 whitespace-pre-line">
            {message.content}
          </div>
          {!message.readStatus && (
            <div className="mt-2">
              <span className="bg-red-100 text-red-700 px-2 py-1 rounded-full text-xs">
                읽지 않음
              </span>
            </div>
          )}
        </div>
      </div>

      <div className="p-4 flex gap-2 border-t">
        <Button
          variant="secondary"
          className="flex-1"
          onClick={() => router.push('/front/message/list')}
        >
          목록
        </Button>
        <Button variant="primary" className="flex-1" onClick={handleDelete}>
          삭제
        </Button>
      </div>
    </div>
  );
}
