import type { OAuthRegisterRequiredResponse } from './auth';

const PENDING_KAKAO_REGISTRATION_KEY = 'itor.pending-kakao-registration';

export function readPendingKakaoRegistration(): OAuthRegisterRequiredResponse | null {
  const storedRegistration = window.sessionStorage.getItem(PENDING_KAKAO_REGISTRATION_KEY);

  if (!storedRegistration) {
    return null;
  }

  try {
    return JSON.parse(storedRegistration) as OAuthRegisterRequiredResponse;
  } catch {
    window.sessionStorage.removeItem(PENDING_KAKAO_REGISTRATION_KEY);
    return null;
  }
}

export function writePendingKakaoRegistration(registration: OAuthRegisterRequiredResponse) {
  window.sessionStorage.setItem(PENDING_KAKAO_REGISTRATION_KEY, JSON.stringify(registration));
}

export function clearPendingKakaoRegistration() {
  window.sessionStorage.removeItem(PENDING_KAKAO_REGISTRATION_KEY);
}
