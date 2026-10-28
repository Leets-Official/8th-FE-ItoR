import { api } from '@/shared/apis/client';

export function startKakaoAuth() {
  if (!api.defaults.baseURL) throw new Error('인증 서버 주소를 설정해주세요.');
  // 302 응답은 브라우저 이동으로 처리해야 카카오 인증 화면으로 연결된다.
  window.location.assign(api.getUri({ url: '/auth/kakao' }));
}
