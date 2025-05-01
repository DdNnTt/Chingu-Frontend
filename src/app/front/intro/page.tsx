import Link from 'next/link';

export default function Intro() {
  return (
    <div className="intro-page py-4 px-4 h-full flex flex-col items-center justify-center">
      <h3 className="text-xl font-bold animate-slideUp opacity-0">
        친구와 더 가까워지는 시간
      </h3>
      <h2 className="mt-2 hakgyo-black text-5xl main-color animate-slideUp delay-400 opacity-0">
        칭구칭구
      </h2>
      <p className="mt-4 animate-slideUp delay-800 opacity-0">
        친구들과 소통하고 그룹으로 추억을 쌓아보세요!
      </p>
      <Link
        href="/front/accout/login"
        className="bg-main-color text-white px-4 py-3 rounded w-full text-center mt-20 inline-block animate-slideUp delay-1200 opacity-0"
      >
        지금 시작하기
      </Link>
    </div>
  );
}
