import { useMutation } from '@tanstack/react-query';

import { authApi } from './authApi';

export function useKakaoAuthMutation() {
  return useMutation({
    // 인가 코드는 한 번만 교환하므로 GET 요청이어도 캐시 조회나 자동 재시도를 하지 않는다.
    mutationFn: (code: string) => authApi.kakaoRedirect(code).then((body) => body.data),
    retry: false,
  });
}
