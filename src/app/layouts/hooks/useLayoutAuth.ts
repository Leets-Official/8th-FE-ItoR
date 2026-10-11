import { useState } from 'react';

import { useNavigate } from 'react-router';

import { MOCK_ACCOUNT } from '@/features/auth/model/mockAccount';
import type { LoginCredentials } from '@/features/auth/model/login';
import type { SignupMethod } from '@/features/auth/model/signup';
import type { Profile, ProfileDraft } from '@/features/profile/model/profile';
import { validateProfile } from '@/features/profile/lib/validateProfile';
import { PREVIEW_USER } from '@/shared/mocks/previewUser';

export function useLayoutAuth() {
  const navigate = useNavigate();
  const [loginOpen, setLoginOpen] = useState(false);
  const [writeAfterLogin, setWriteAfterLogin] = useState(false);
  const [previewSignedIn, setPreviewSignedIn] = useState(false);
  const [method, setMethod] = useState<SignupMethod>('email');
  // shortcut: 세션 내 프로필·인증 미리보기. 인증 및 사용자 API 연결 시 서버 상태로 교체한다.
  const [profiles, setProfiles] = useState<Record<SignupMethod, Profile>>({
    email: MOCK_ACCOUNT.profile,
    kakao: {
      ...PREVIEW_USER,
      id: 'preview-kakao-member',
      method: 'kakao',
      email: 'djhakjhs1726@naver.com',
      name: '김릿츠',
      birthDate: '2000-01-01',
    },
  });
  const [emailPassword, setEmailPassword] = useState(MOCK_ACCOUNT.password);

  function openLogin() {
    setLoginOpen(true);
  }

  function changeLoginOpen(open: boolean) {
    setLoginOpen(open);
    if (!open) setWriteAfterLogin(false);
  }

  function completeLogin(nextMethod: SignupMethod, credentials?: LoginCredentials) {
    if (
      nextMethod === 'email' &&
      (!credentials ||
        credentials.email !== profiles.email.email ||
        credentials.password !== emailPassword)
    )
      return false;
    setMethod(nextMethod);
    setPreviewSignedIn(true);
    setLoginOpen(false);
    setWriteAfterLogin(false);
    if (writeAfterLogin) navigate('/posts/new');
    return true;
  }

  function updateProfile(draft: ProfileDraft) {
    if (!previewSignedIn) return false;
    const values =
      method === 'email'
        ? { ...draft, email: profiles.email.email, name: profiles.email.name }
        : draft;
    if (Object.keys(validateProfile(values, method)).length) return false;
    setProfiles((previous) => ({
      ...previous,
      [method]: {
        ...previous[method],
        nickname: values.nickname.trim(),
        introduction: values.introduction,
        email: values.email.trim(),
        name: values.name.trim(),
        birthDate: values.birthDate.replace(/\s/g, ''),
        avatarUrl: values.avatarUrl,
      },
    }));
    if (method === 'email' && values.password) setEmailPassword(values.password);
    return true;
  }

  function startWriting() {
    if (previewSignedIn) navigate('/posts/new');
    else {
      setWriteAfterLogin(true);
      openLogin();
    }
  }

  function logout() {
    setPreviewSignedIn(false);
    setLoginOpen(false);
    setWriteAfterLogin(false);
    navigate('/');
  }

  return {
    loginOpen,
    profiles,
    previewUser: previewSignedIn ? profiles[method] : null,
    updateProfile,
    setPreviewSignedIn,
    openLogin,
    changeLoginOpen,
    completeLogin,
    startWriting,
    logout,
  };
}
