import { Suspense } from 'react';
import SearchUser from './SearchUser';

export default function SearchPage() {
  return (
    <Suspense fallback={<p className="text-center mt-8">로딩 중...</p>}>
      <SearchUser />
    </Suspense>
  );
}
