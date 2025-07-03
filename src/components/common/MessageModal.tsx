'use client';

import { useState } from 'react';
import Button from './Button';
import axiosInstance from '@/libs/axios';

interface MessageModalProps {
  isOpen: boolean;
  onClose: () => void;
  receiver: string;
  receiverName: string;
  isFriend: boolean;
}

interface MessageResponse {
  messageId: number;
  sender: string;
  receiver: string;
  content: string;
  sendTime: string;
  readStatus: boolean;
  senderDeleted: boolean;
  receiverDeleted: boolean;
}

export default function MessageModal({
  isOpen,
  onClose,
  receiver,
  receiverName,
  isFriend,
}: MessageModalProps) {
  const [content, setContent] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!content.trim()) {
      setError('쪽지 내용을 입력해주세요.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await axiosInstance.post<MessageResponse>(
        '/api/messages/send',
        {
          receiver: receiverName, // 닉네임으로 변경
          content: content.trim(),
        }
      );

      console.log('쪽지 전송 성공:', response.data);
      alert('쪽지가 성공적으로 전송되었습니다!');
      setContent('');
      onClose();
    } catch (err) {
      console.error('쪽지 전송 에러:', err);
      setError('쪽지 전송에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    if (!isLoading) {
      setContent('');
      setError(null);
      onClose();
    }
  };

  if (!isOpen) return null;

  // 친구가 아닌 경우 쪽지 보내기 불가
  if (!isFriend) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">쪽지 보내기</h3>
              <button
                onClick={handleClose}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <div className="text-center py-8">
              <div className="text-red-500 mb-4">
                <svg
                  className="w-16 h-16 mx-auto mb-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                  />
                </svg>
              </div>
              <h4 className="text-lg font-semibold mb-2">친구가 아닙니다</h4>
              <p className="text-gray-600 mb-6">
                쪽지를 보내려면 먼저 친구가 되어야 합니다.
              </p>
              <Button onClick={handleClose} className="bg-blue-600 text-white">
                확인
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">쪽지 보내기</h3>
            <button
              onClick={handleClose}
              disabled={isLoading}
              className="text-gray-400 hover:text-gray-600 disabled:opacity-50"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                받는 사람
              </label>
              <div className="p-3 bg-gray-50 rounded-md text-gray-900">
                {receiverName} ({receiver})
              </div>
            </div>

            <div className="mb-4">
              <label
                htmlFor="content"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                쪽지 내용
              </label>
              <textarea
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="쪽지 내용을 입력해주세요..."
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                rows={6}
                maxLength={500}
                disabled={isLoading}
              />
              <div className="text-right text-sm text-gray-500 mt-1">
                {content.length}/500
              </div>
            </div>

            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            )}

            <div className="flex gap-2">
              <Button
                type="button"
                onClick={handleClose}
                variant="secondary"
                className="flex-1"
                disabled={isLoading}
              >
                취소
              </Button>
              <Button
                type="submit"
                className="flex-1 bg-blue-600 text-white"
                disabled={isLoading || !content.trim()}
              >
                {isLoading ? '전송 중...' : '보내기'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
