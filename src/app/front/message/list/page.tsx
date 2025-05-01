'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function MessageList() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('sent');

  const messages = [
    {
      id: 1,
      sender: '닉네임1',
      content: '쪽지 내용입니다.',
      date: '2025.04.24',
    },
    {
      id: 2,
      sender: '닉네임2',
      content: '쪽지 내용입니다.',
      date: '2025.04.24',
    },
    {
      id: 3,
      sender: '닉네임3',
      content: '쪽지 내용입니다.',
      date: '2025.04.24',
    },
    {
      id: 4,
      sender: '닉네임4',
      content: '쪽지 내용입니다.',
      date: '2025.04.24',
    },
  ];

  return (
    <div className="my-home-page py-4 px-4 pt-20 mx-auto rounded-lg bg-gray-100">
      <h2 className="text-2xl font-semibold mb-6 text-center">나의 쪽지함</h2>

      <div className="flex mb-4 gap-2">
        <button
          className={`flex-1 py-2 text-center rounded-lg ${activeTab === 'sent' ? 'bg-main-color text-white' : 'bg-white'}`}
          onClick={() => setActiveTab('sent')}
        >
          보낸 쪽지
        </button>
        <button
          className={`flex-1 py-2 text-center rounded-lg ${activeTab === 'received' ? 'bg-main-color text-white' : 'bg-white'}`}
          onClick={() => setActiveTab('received')}
        >
          받은 쪽지
        </button>
      </div>

      <div className="space-y-2">
        {messages.map((message) => (
          <div
            key={message.id}
            className="bg-white p-4 rounded-lg shadow-sm cursor-pointer hover:bg-gray-50"
            onClick={() =>
              router.push(`/front/message/detail?id=${message.id}`)
            }
          >
            <div className="text-gray-600 text-sm">
              {activeTab === 'sent' ? '받는 사람 ' : '보낸 사람 '}
              <span className="main-color">{message.sender}</span>
            </div>
            <div className="text-gray-600">{message.content}</div>
            <div className="text-sm text-gray-400">{message.date}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
