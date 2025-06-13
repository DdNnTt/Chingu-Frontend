import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="not-found-page py-4 px-4 h-full flex flex-col items-center justify-center">
      <h2 className="hakgyo-black text-6xl main-color animate-slideUp opacity-0">
        404
      </h2>
      <h3 className="mt-4 text-xl font-bold animate-slideUp delay-400 opacity-0">
        페이지를 찾을 수 없어요
      </h3>
      <p className="mt-4 text-center animate-slideUp delay-800 opacity-0">
        요청하신 페이지가 존재하지 않거나
        <br />
        이동되었을 수 있습니다
      </p>
      <Link
        href="/"
        className="bg-main-color text-white px-4 py-3 rounded w-full text-center mt-20 inline-block animate-slideUp delay-1200 opacity-0"
      >
        홈으로 돌아가기
      </Link>
    </div>
  );
}
