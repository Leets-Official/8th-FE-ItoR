import { useSearch } from '@tanstack/react-router';

import { KakaoCallbackSection } from '@/features/oauth/kakao/sections/KakaoCallbackSection';

export default function KakaoCallbackPage() {
  const { code } = useSearch({ from: '/oauth/kakao/success' });
  return <KakaoCallbackSection code={code} />;
}
