import Link from 'next/link';

export default function Intro() {
  return (
    <div
      className="intro-page relative h-full flex flex-col items-center justify-center overflow-hidden tracking-tight"
      style={{ letterSpacing: '-0.5px' }}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100"></div>
      <div className="absolute top-10 left-6 w-32 h-32 bg-purple-200 rounded-full opacity-30 animate-pulse"></div>
      <div className="absolute bottom-10 right-8 w-24 h-24 bg-blue-200 rounded-full opacity-40 animate-pulse delay-1000"></div>
      <div className="absolute top-1/3 right-0 w-16 h-16 bg-pink-200 rounded-full opacity-30 animate-pulse delay-700"></div>
      <div className="absolute bottom-1/4 left-0 w-20 h-20 bg-indigo-200 rounded-full opacity-20 animate-pulse delay-500"></div>
      <div
        className="absolute top-1/2 left-1/2 w-12 h-12 bg-yellow-100 rounded-full opacity-20 animate-pulse delay-300"
        style={{ transform: 'translate(-50%, -50%)' }}
      ></div>
      <div className="relative z-10 w-full max-w-sm mx-auto px-6">
        <div className="text-center space-y-4">
          <h3 className="text-lg font-medium text-gray-700 animate-slideUp opacity-0">
            친구와 더 가까워지는 시간
          </h3>
          <h2 className="hakgyo-black text-7xl main-color animate-slideUp delay-300 opacity-0 drop-shadow-sm">
            칭구칭구
          </h2>
          <p className="text-gray-600 leading-relaxed animate-slideUp delay-600 opacity-0">
            친구들과 소통하고 그룹으로 추억을 쌓아보세요!
          </p>
        </div>
        <div className="flex justify-center mb-8 animate-slideUp delay-900 opacity-0">
          <img
            src="/images/friend.png"
            alt="친구와 대화하는 3D 캐릭터"
            className="w-70 h-70 object-contain"
          />
        </div>
        <div className="mt-12 animate-slideUp delay-1200 opacity-0">
          <Link
            href="/front/account/login"
            className="group relative w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-4 rounded-2xl text-center font-medium shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 flex items-center justify-center gap-3"
          >
            <span>지금 시작하기</span>
            <svg
              className="w-5 h-5 group-hover:translate-x-1 transition-transform"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 7l5 5m0 0l-5 5m5-5H6"
              />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
}
