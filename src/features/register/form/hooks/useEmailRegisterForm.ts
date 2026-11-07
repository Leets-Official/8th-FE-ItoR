import { useState, type FormEvent } from 'react';
import { useNavigate } from '@tanstack/react-router';

import { getApiErrorMessage } from '@/shared/api/apiClient';
import { useAuth } from '@/shared/auth/hooks/useAuth';

import { postRegister } from '../api/emailRegisterApi';
import { uploadProfileImage } from '../api/profileImageApi';
import {
  getEmailRegistrationErrors,
  INITIAL_REGISTRATION_VALUES,
  type RegistrationField,
} from '../model/emailRegistration';

export function useEmailRegisterForm() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [values, setValues] = useState(INITIAL_REGISTRATION_VALUES);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [isCompletionDialogOpen, setIsCompletionDialogOpen] = useState(false);
  const [apiErrorMessage, setApiErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [profileImageFile, setProfileImageFile] = useState<File | null>(null);
  const normalizedBirthDate = values.birthDate.replaceAll(' ', '');
  const errors = getEmailRegistrationErrors(values);
  const hasError = Object.values(errors).some(Boolean);

  function updateValue(field: RegistrationField, value: string) {
    setValues((currentValues) => ({ ...currentValues, [field]: value }));
  }

  async function submitRegistration(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setHasSubmitted(true);

    if (hasError) {
      return;
    }

    setIsSubmitting(true);
    setApiErrorMessage('');

    try {
      const profilePicture = profileImageFile ? await uploadProfileImage(profileImageFile) : '';

      await postRegister({
        email: values.email,
        nickname: values.nickname,
        password: values.password,
        profilePicture,
        birthDate: normalizedBirthDate,
        name: values.name,
        introduction: values.introduction,
      });
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

  async function loginAndMoveToMainPage() {
    if (isLoggingIn) {
      return;
    }

    setIsLoggingIn(true);
    setApiErrorMessage('');

    try {
      await login({ email: values.email.trim(), password: values.password });
      setIsCompletionDialogOpen(false);
      await navigate({ to: '/' });
    } catch (error) {
      setApiErrorMessage(getApiErrorMessage(error, '로그인에 실패했습니다. 다시 시도해주세요.'));
    } finally {
      setIsLoggingIn(false);
    }
  }

  return {
    values,
    errors,
    hasSubmitted,
    isCompletionDialogOpen,
    apiErrorMessage,
    isSubmitting,
    isLoggingIn,
    updateValue,
    selectProfileImage: setProfileImageFile,
    submitRegistration,
    moveToMainPage,
    loginAndMoveToMainPage,
  };
}
