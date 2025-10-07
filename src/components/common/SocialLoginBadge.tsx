'use client';

import React from 'react';

interface SocialLoginBadgeProps {
  socialType?: string;
  className?: string;
}

export default function SocialLoginBadge({
  socialType,
  className = '',
}: SocialLoginBadgeProps) {
  if (!socialType) return null;

  const getSocialInfo = (type: string) => {
    switch (type.toLowerCase()) {
      case 'google':
        return {
          name: 'Google',
          icon: (
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
          ),
          bgColor: 'bg-blue-50',
          textColor: 'text-blue-700',
          borderColor: 'border-blue-200',
        };
      case 'kakao':
        return {
          name: 'Kakao',
          icon: (
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path
                fill="#FEE500"
                d="M12 3C6.48 3 2 6.48 2 12c0 3.69 2.47 6.86 6 8.25V22l3.5-1.75L15 22v-1.75c3.53-1.39 6-4.56 6-8.25 0-5.52-4.48-10-10-10z"
              />
              <path
                fill="#3C1E1E"
                d="M12 3C6.48 3 2 6.48 2 12c0 3.69 2.47 6.86 6 8.25V22l3.5-1.75L15 22v-1.75c3.53-1.39 6-4.56 6-8.25 0-5.52-4.48-10-10-10z"
              />
            </svg>
          ),
          bgColor: 'bg-yellow-50',
          textColor: 'text-yellow-800',
          borderColor: 'border-yellow-200',
        };
      case 'naver':
        return {
          name: 'Naver',
          icon: (
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path
                fill="#03C75A"
                d="M16.273 12.845 7.376 0H0v24h7.726V11.156L16.624 24H24V0h-7.727v12.845Z"
              />
            </svg>
          ),
          bgColor: 'bg-green-50',
          textColor: 'text-green-700',
          borderColor: 'border-green-200',
        };
      default:
        return {
          name: 'Social',
          icon: (
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
            </svg>
          ),
          bgColor: 'bg-gray-50',
          textColor: 'text-gray-700',
          borderColor: 'border-gray-200',
        };
    }
  };

  const socialInfo = getSocialInfo(socialType);

  return (
    <div
      className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium border ${socialInfo.bgColor} ${socialInfo.textColor} ${socialInfo.borderColor} ${className}`}
    >
      {socialInfo.icon}
      <span>{socialInfo.name}</span>
    </div>
  );
}
