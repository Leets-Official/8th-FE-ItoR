import { useState, type FormEvent } from 'react';
import { useNavigate } from '@tanstack/react-router';

import {
  BIRTH_DATE_PATTERN,
  INITIAL_REGISTRATION_VALUES,
  LAST_AVAILABLE_BIRTH_DATE,
  type RegistrationField,
} from '../model/registration';

export function useEmailRegisterForm() {
  const navigate = useNavigate();
  const [values, setValues] = useState(INITIAL_REGISTRATION_VALUES);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [isCompletionDialogOpen, setIsCompletionDialogOpen] = useState(false);
  const normalizedBirthDate = values.birthDate.replaceAll(' ', '');
  const errors = {
    email: values.email.trim().length === 0,
    passwordConfirm: values.password.length === 0 || values.password !== values.passwordConfirm,
    name: values.name.trim().length === 0,
    birthDate:
      !BIRTH_DATE_PATTERN.test(normalizedBirthDate) ||
      normalizedBirthDate > LAST_AVAILABLE_BIRTH_DATE,
    nickname: values.nickname.trim().length === 0 || values.nickname.length > 20,
    introduction: values.introduction.trim().length === 0 || values.introduction.length > 30,
  };
  const hasError = Object.values(errors).some(Boolean);

  function updateValue(field: RegistrationField, value: string) {
    setValues((currentValues) => ({ ...currentValues, [field]: value }));
  }

  function submitRegistration(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setHasSubmitted(true);

    if (!hasError) {
      setIsCompletionDialogOpen(true);
    }
  }

  async function moveToMainPage() {
    setIsCompletionDialogOpen(false);

    // TODO(API): 회원가입 성공 후 확인은 메인으로, 로그인은 자동 로그인 후 메인으로 이동합니다.
    await navigate({ to: '/' });
  }

  return {
    values,
    errors,
    hasSubmitted,
    isCompletionDialogOpen,
    updateValue,
    submitRegistration,
    moveToMainPage,
  };
}
