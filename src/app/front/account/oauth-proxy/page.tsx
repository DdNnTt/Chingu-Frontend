'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

function OAuthProxyContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<
    'loading' | 'processing' | 'success' | 'error'
  >('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const handleOAuthProxy = async () => {
      try {
        setStatus('processing');
        setMessage('OAuth2 콜백 처리 중...');

        // URL에서 토큰 추출 시도
        const token = searchParams.get('token');

        if (token) {
          console.log('OAuth2 토큰 수신 (프록시): 성공');

          // 토큰을 쿠키에 저장
          document.cookie = `accessToken=${token}; path=/; secure; SameSite=Lax`;

          setStatus('success');
          setMessage('소셜 로그인 성공! 메인 페이지로 이동합니다.');

          // 잠시 후 메인 페이지로 리다이렉트
          setTimeout(() => {
            router.push('/front/my-home');
          }, 1500);
        } else {
          // 토큰이 없는 경우, 사용자에게 수동 입력 요청
          setStatus('error');
          setMessage('토큰을 찾을 수 없습니다. 수동으로 입력해주세요.');

          // 수동 토큰 입력 UI 표시
          setTimeout(() => {
            const manualToken = prompt('OAuth2 토큰을 입력해주세요:');
            if (manualToken) {
              document.cookie = `accessToken=${manualToken}; path=/; secure; SameSite=Lax`;
              router.push('/front/my-home');
            } else {
              router.push('/front/account/login');
            }
          }, 2000);
        }
      } catch (error) {
        console.error('OAuth 프록시 처리 오류:', error);
        setStatus('error');
        setMessage('로그인 처리 중 오류가 발생했습니다.');
        setTimeout(() => {
          router.push('/front/account/login');
        }, 3000);
      }
    };

    handleOAuthProxy();
  }, [searchParams, router]);

  return (
    <div className="flex items-center justify-center bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100">
      <div className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full mx-4">
        <div className="text-center">
          {status === 'loading' && (
            <>
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-main-color mx-auto mb-4"></div>
              <h2 className="text-xl font-semibold text-gray-800 mb-2">
                OAuth2 프록시 처리 중...
              </h2>
              <p className="text-gray-600">잠시만 기다려주세요.</p>
            </>
          )}

          {status === 'processing' && (
            <>
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
              <h2 className="text-xl font-semibold text-gray-800 mb-2">
                OAuth2 콜백 처리 중...
              </h2>
              <p className="text-gray-600">{message}</p>
            </>
          )}

          {status === 'success' && (
            <>
              <div className="text-green-500 mb-4">
                <svg
                  className="w-16 h-16 mx-auto"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <h2 className="text-xl font-semibold text-gray-800 mb-2">
                로그인 성공!
              </h2>
              <p className="text-gray-600">{message}</p>
            </>
          )}

          {status === 'error' && (
            <>
              <div className="text-red-500 mb-4">
                <svg
                  className="w-16 h-16 mx-auto"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <h2 className="text-xl font-semibold text-gray-800 mb-2">
                처리 실패
              </h2>
              <p className="text-gray-600">{message}</p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default function OAuthProxy() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100">
          <div className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full mx-4">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
              <h2 className="text-xl font-semibold text-gray-800 mb-2">
                페이지 로딩 중...
              </h2>
              <p className="text-gray-600">잠시만 기다려주세요.</p>
            </div>
          </div>
        </div>
      }
    >
      <OAuthProxyContent />
    </Suspense>
  );
}
