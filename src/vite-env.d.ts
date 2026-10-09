/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL: string;
  // 카카오 디벨로퍼스 > 앱 키 > REST API 키
  readonly VITE_KAKAO_REST_API_KEY?: string;
  // 없으면 {현재 origin}/oauth/kakao
  readonly VITE_KAKAO_REDIRECT_URI?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
