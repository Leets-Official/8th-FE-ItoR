import { showToast } from '@/shared/ui';

// 카카오 로그인 화면은 카카오가 직접 띄운다. 우리 앱은 인가 URL로 보내고, 돌아온 인가 코드를 받기만 한다
// https://developers.kakao.com/docs/latest/ko/kakaologin/rest-api#request-code
const KAKAO_AUTHORIZE_URL = 'https://kauth.kakao.com/oauth/authorize';

export const KAKAO_CALLBACK_PATH = '/oauth/kakao';

// 카카오 디벨로퍼스 앱 설정에 등록한 Redirect URI와 정확히 같아야 한다
function getKakaoRedirectUri() {
  return (
    import.meta.env.VITE_KAKAO_REDIRECT_URI || `${window.location.origin}${KAKAO_CALLBACK_PATH}`
  );
}

interface KakaoAuthOptions {
  // 로그인 후 돌아갈 경로. 없으면 출발한 페이지로 돌아간다
  returnPath?: string;
}

// 카카오가 그대로 돌려주는 state 파라미터에 돌아갈 경로를 담는다
export function redirectToKakaoAuth({
  returnPath = window.location.pathname,
}: KakaoAuthOptions = {}) {
  const clientId = import.meta.env.VITE_KAKAO_REST_API_KEY;
  if (!clientId) {
    showToast('negative', '카카오 앱 키가 설정되지 않았습니다.');
    return;
  }

  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: getKakaoRedirectUri(),
    response_type: 'code',
    state: returnPath,
  });
  window.location.assign(`${KAKAO_AUTHORIZE_URL}?${params}`);
}

// state는 주소창에서 바꿀 수 있으므로 앱 안의 경로(/로 시작, //는 다른 사이트)만 받아들인다
export function getKakaoReturnPath(state: string | null) {
  return state?.startsWith('/') && !state.startsWith('//') ? state : '/';
}

export const KAKAO_SIGN_UP_PATH = '/signup/kakao';

// 가입되지 않은 카카오 계정으로 돌아왔을 때, 출발한 페이지에서 회원가입 여부를 묻도록 location state로 알린다
interface KakaoSignUpPromptState {
  kakaoSignUpPrompt: true;
}

export const KAKAO_SIGN_UP_PROMPT_STATE: KakaoSignUpPromptState = { kakaoSignUpPrompt: true };

export function hasKakaoSignUpPrompt(state: unknown) {
  return (
    typeof state === 'object' &&
    state !== null &&
    (state as Partial<KakaoSignUpPromptState>).kakaoSignUpPrompt === true
  );
}
