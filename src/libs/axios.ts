import axios, { InternalAxiosRequestConfig } from 'axios';
import { getCookieValue } from '@/utils/cookie';

const getBaseURL = () => {
  // 브라우저 환경(클라이언트)에서는 baseURL 없이 상대 경로 사용
  if (typeof window !== 'undefined') {
    return '';
  }
  // 서버 환경에서는 백엔드 URL 사용
  return process.env.API_BASE_URL || '';
};

const instance = axios.create({
  baseURL: getBaseURL(),
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

instance.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = getCookieValue('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default instance;
