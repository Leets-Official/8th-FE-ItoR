import { createFileRoute } from '@tanstack/react-router';

import KakaoCallbackPage from '@/pages/oauth/kakao/KakaoCallbackPage';

type KakaoCallbackSearch = {
  code?: string;
};

export const Route = createFileRoute('/oauth/kakao/success')({
  validateSearch: (search: Record<string, unknown>): KakaoCallbackSearch => ({
    code: typeof search.code === 'string' ? search.code : undefined,
  }),
  component: KakaoCallbackPage,
  staticData: { headerVariant: 'register' },
});
