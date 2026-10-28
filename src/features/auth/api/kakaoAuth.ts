// 카카오 인가 URL은 서버가 만든다. GET /auth/kakao가 JSON 대신 302로 카카오 로그인 화면에 보내므로
// axios로 부르면 카카오 쪽 CORS에 막힌다. 페이지 자체를 이동시켜야 한다
const KAKAO_AUTH_URL = `${import.meta.env.VITE_API_BASE_URL}/auth/kakao`;

// 서버가 카카오에 넘기는 redirect_uri(http://localhost:3000/oauth/kakao/success)와 같아야 한다
export const KAKAO_CALLBACK_PATH = '/oauth/kakao/success';

// 서버가 만든 인가 URL에는 state가 없어 돌아갈 경로를 카카오를 거쳐 전달할 수 없다.
// 같은 탭에서 카카오에 다녀오는 동안 남아 있는 sessionStorage에 적어 둔다
const RETURN_PATH_KEY = 'kakaoReturnPath';

interface KakaoAuthOptions {
  // 로그인 후 돌아갈 경로. 없으면 출발한 페이지로 돌아간다
  returnPath?: string;
}

export function redirectToKakaoAuth({
  returnPath = window.location.pathname,
}: KakaoAuthOptions = {}) {
  try {
    sessionStorage.setItem(RETURN_PATH_KEY, returnPath);
  } catch {
    // 저장소를 쓸 수 없는 환경이면 홈으로 돌아온다
  }
  window.location.assign(KAKAO_AUTH_URL);
}

// 저장해 둔 경로는 한 번 쓰고 지운다. 주소창 조작 등으로 바뀔 수 있으므로
// 앱 안의 경로(/로 시작, //는 다른 사이트)만 받아들인다
export function takeKakaoReturnPath() {
  let returnPath: string | null;
  try {
    returnPath = sessionStorage.getItem(RETURN_PATH_KEY);
    sessionStorage.removeItem(RETURN_PATH_KEY);
  } catch {
    // 저장소를 쓸 수 없으면 홈으로 보낸다. 읽기만 하고 지우지 못했어도 남은 경로를 쓰지 않는다
    return '/';
  }
  return returnPath?.startsWith('/') && !returnPath.startsWith('//') ? returnPath : '/';
}

// 가입되지 않은 카카오 계정이면 서버가 kakaoId를 준다. 회원가입 폼을 채우는 동안 남아 있도록 저장해 두고
// /auth/register-oauth에 함께 보낸다
const KAKAO_ID_KEY = 'kakaoId';

export function saveKakaoId(kakaoId: number) {
  try {
    sessionStorage.setItem(KAKAO_ID_KEY, String(kakaoId));
  } catch {
    // 저장소를 쓸 수 없으면 가입할 때 카카오 로그인을 다시 거친다
  }
}

export function readKakaoId() {
  try {
    const stored = sessionStorage.getItem(KAKAO_ID_KEY);
    return stored ? Number(stored) : undefined;
  } catch {
    return undefined;
  }
}

export function clearKakaoId() {
  try {
    sessionStorage.removeItem(KAKAO_ID_KEY);
  } catch {
    // 저장소를 쓸 수 없으면 지울 값도 없다
  }
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
