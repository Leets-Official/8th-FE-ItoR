import axios from 'axios';

/**
 * 모든 API 요청이 공유하는 axios 인스턴스.
 * 2주차는 UI만 구현하므로 아직 호출하는 곳은 없고,
 * 3주차부터 인증 토큰 헤더와 토큰 재발급 인터셉터를 여기에 추가한다.
 */
export const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 10_000,
  headers: {
    'Content-Type': 'application/json',
  },
});
