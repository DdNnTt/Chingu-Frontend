'use client';

import { useRouter } from 'next/navigation';
import Button from '@/components/common/Button';
import { useState, useEffect } from 'react';

export default function MessageWrite() {
  const router = useRouter();
  const [currentDate, setCurrentDate] = useState('');

  useEffect(() => {
    setCurrentDate(new Date().toLocaleDateString());
  }, []);

  const handleSendMessage = () => {
    alert('쪽지가 전송되었습니다.');
    router.push('/front/message/list');
  };

  return (
    <div className="flex flex-col bg-gray-100 overflow-hidden">
      <div className="bg-white p-4 flex items-center border-b">
        <h1 className="text-xl font-semibold text-center flex-1">
          쪽지 보내기
        </h1>
      </div>

      <div className="flex-1 p-4">
        <div className="bg-white rounded-lg p-4 h-full flex flex-col">
          <div className="mb-4">
            <div className="text-sm text-gray-600 mb-1">받는 사람</div>
            <div className="font-medium">닉네임 자동 입력</div>
          </div>

          <div className="mb-4">
            <div className="text-sm text-gray-400">보낸 날짜 {currentDate}</div>
          </div>

          <div className="flex-1">
            <textarea
              className="w-full h-full p-2 border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-main-color"
              placeholder="메시지를 입력하세요..."
            />
          </div>
        </div>
      </div>

      <div className="bg-white p-4 flex gap-2 border-t">
        <Button
          type="button"
          variant="secondary"
          className="flex-1"
          onClick={() => router.back()}
        >
          취소
        </Button>
        <Button
          type="button"
          variant="primary"
          className="flex-1"
          onClick={handleSendMessage}
        >
          보내기
        </Button>
      </div>
    </div>
  );
}
