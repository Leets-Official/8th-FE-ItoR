import { useState, type FormEvent } from 'react';
import { useNavigate } from '@tanstack/react-router';

import { getKakaoLoginUrl } from '@/shared/auth/api/authApi';
import type { OAuthRegisterRequiredResponse } from '@/shared/auth/model/auth';
import { clearPendingKakaoRegistration } from '@/shared/auth/model/pendingKakaoRegistration';
import { getApiErrorMessage } from '@/shared/api/apiClient';

import { postOAuthRegister } from '../api/kakaoRegisterApi';
import { uploadProfileImage } from '../api/profileImageApi';
import {
  createInitialKakaoRegistrationValues,
  getKakaoRegistrationErrors,
  type KakaoRegistrationField,
} from '../model/kakaoRegistration';

export function useKakaoRegisterForm(registration: OAuthRegisterRequiredResponse | null) {
  const navigate = useNavigate();
  const [values, setValues] = useState(() => createInitialKakaoRegistrationValues(registration));
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [isCompletionDialogOpen, setIsCompletionDialogOpen] = useState(false);
  const [apiErrorMessage, setApiErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [profileImageFile, setProfileImageFile] = useState<File | null>(null);
  const normalizedBirthDate = values.birthDate.replaceAll(' ', '');
  const errors = getKakaoRegistrationErrors(values);
  const hasError = Object.values(errors).some(Boolean);

  function updateValue(field: KakaoRegistrationField, value: string) {
    setValues((currentValues) => ({ ...currentValues, [field]: value }));
  }

  async function submitRegistration(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setHasSubmitted(true);

    if (hasError || values.kakaoId === 0) {
      if (values.kakaoId === 0) {
        setApiErrorMessage('카카오 로그인 정보가 없습니다. 다시 로그인해주세요.');
      }
      return;
    }

    setIsSubmitting(true);
    setApiErrorMessage('');

    try {
      const profilePicture = profileImageFile
        ? await uploadProfileImage(profileImageFile)
        : values.profilePicture;

      await postOAuthRegister({ ...values, profilePicture, birthDate: normalizedBirthDate });
      clearPendingKakaoRegistration();
      setIsCompletionDialogOpen(true);
    } catch (error) {
      setApiErrorMessage(getApiErrorMessage(error, '회원가입에 실패했습니다.'));
    } finally {
      setIsSubmitting(false);
    }
  }

  async function moveToMainPage() {
    setIsCompletionDialogOpen(false);
    await navigate({ to: '/' });
  }

  function startKakaoLogin() {
    window.location.assign(getKakaoLoginUrl());
  }

  return {
    values,
    errors,
    hasSubmitted,
    isCompletionDialogOpen,
    apiErrorMessage,
    isSubmitting,
    updateValue,
    selectProfileImage: setProfileImageFile,
    submitRegistration,
    moveToMainPage,
    startKakaoLogin,
  };
}
