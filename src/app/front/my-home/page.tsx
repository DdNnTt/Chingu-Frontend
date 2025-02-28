import Link from 'next/link';
import Image from 'next/image';
import Button from '@/components/common/Button';

export default function MyHome() {
  return (
    <div className="my-home-page py-4 px-4 pt-20 mx-auto rounded-lg bg-gray-100">
      <h2 className="text-2xl font-semibold mb-6 text-center">마이 홈</h2>

      <div className="profile-card flex items-center mb-4 p-4 bg-white rounded-lg shadow-sm gap-2">
        <Image
          src="/images/test-profile.png"
          alt="프로필 사진"
          width={64}
          height={64}
          className="object-cover rounded-full border border-gray-300"
        />
        <div className="profile-info">
          <h3 className="text-lg font-semibold">닉네임</h3>
          <p className="text-sm text-gray-500">
            친구 수 <span>20</span>
          </p>
        </div>
      </div>

      <div className="profile-intro p-4 bg-white rounded-lg shadow-sm mb-4">
        <p className="text-gray-700">자기소개 멘트</p>
      </div>

      <div className="flex gap-2 mb-4">
        <Link
          href="/front/message/list"
          className="message-box flex-1 bg-main-color text-white px-4 py-3 rounded-md text-center flex items-center justify-center"
        >
          <span>나의 쪽지함</span>
          <span className="ml-2 bg-red-500 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full">
            5
          </span>
        </Link>

        <Button type="button" className="flex-1 text-white">
          일정 등록
        </Button>
      </div>

      <div className="schedule-calendar bg-white p-6 rounded-lg shadow-sm mb-4 text-center text-gray-500">
        일정 캘린더가 들어갈 부분
      </div>

      <div className="my-groups bg-white p-4 rounded-lg shadow-sm">
        <h3 className="text-lg font-semibold mb-2">내 그룹 목록</h3>
        <div className="group-item bg-gray-200 p-3 rounded mb-2">그룹1</div>
        <div className="group-item bg-gray-200 p-3 rounded mb-2">그룹2</div>
        <div className="group-item bg-gray-200 p-3 rounded">그룹3</div>

        <Button
          type="button"
          className="flex-1 w-full bg-blue-600 text-white mt-4"
        >
          더보기
        </Button>
      </div>
    </div>
  );
}
