import { redirect } from '@tanstack/react-router';

import { readStoredAuth } from '@/shared/api/authStorage';

/** 인증이 필요한 라우트에서 로그인 모달이 열리는 메인 페이지로 이동시킵니다. */
export function requireAuth() {
  if (!readStoredAuth()) {
    throw redirect({ to: '/', search: { loginRequired: true } });
  }
}
