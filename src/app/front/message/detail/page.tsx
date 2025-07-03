import { Suspense } from 'react';
import MessageDetail from './MessageDetail';

export default function MessageDetailPage() {
  return (
    <Suspense fallback={<div>쪽지를 불러오는 중</div>}>
      <MessageDetail />
    </Suspense>
  );
}
