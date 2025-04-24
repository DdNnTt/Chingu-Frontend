'use client';

import { useRouter, useSearchParams } from 'next/navigation';

export default function MessageDetail() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const messageId = searchParams.get('id');

  const message = {
    id: messageId,
    sender: '닉네임1',
    content: '쪽지 내용입니다. 테스트입니다.',
    date: '2025.04.24',
  };

  const handleDelete = () => {
    const isConfirmed = confirm('쪽지를 삭제하시겠습니까?');

    if (isConfirmed) {
      alert('해당 쪽지가 삭제되었습니다.');
      router.push('/front/message/list');
    }
  };

  return (
    <div className="flex flex-col bg-gray-100 overflow-hidden">
      <div className="bg-white p-4 flex items-center border-b">
        <button onClick={() => router.back()} className="text-gray-600">
          뒤로
        </button>
        <h1 className="text-center flex-1 font-semibold">
          보낸 사람: {message.sender}
        </h1>
        <div className="w-10"></div>
      </div>

      <div className="flex-1 p-4">
        <div className="bg-white rounded-lg p-4 min-h-[200px]">
          <div className="text-sm text-gray-400 mb-2">{message.date}</div>
          <div className="text-gray-800 whitespace-pre-line">
            {message.content}
          </div>
        </div>
      </div>

      <div className="bg-white p-4 flex gap-4 border-t">
        <button
          className="flex-1 py-2 text-center bg-gray-200 rounded-lg"
          onClick={handleDelete}
        >
          삭제
        </button>
        <button
          className="flex-1 py-2 text-center bg-main-color text-white rounded-lg"
          onClick={() => router.push('/front/message/list')}
        >
          목록
        </button>
      </div>
    </div>
  );
}
