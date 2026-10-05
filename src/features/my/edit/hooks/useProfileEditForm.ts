import { useState, type FormEvent } from 'react';
import { useNavigate } from '@tanstack/react-router';

import { useToast } from '@/shared/ui/toast/hooks/useToast';

import type { MyProfile } from '../../model/my';
import { useProfileEditMode } from './useProfileEditMode';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function useProfileEditForm(initialProfile: MyProfile) {
  const { isEditing, stopEditing } = useProfileEditMode();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [values, setValues] = useState(initialProfile);
  const errors = {
    nickname: values.nickname.length > 20,
    email: !EMAIL_PATTERN.test(values.email),
    passwordConfirm: values.password !== values.passwordConfirm,
  };

  function updateValue(field: keyof MyProfile, value: string) {
    setValues((currentValues) => ({ ...currentValues, [field]: value }));
  }

  async function submitProfile(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (Object.values(errors).some(Boolean)) {
      return;
    }

    // TODO(API): 프로필 저장 요청 성공 후 마이페이지로 이동하고 완료 토스트를 표시합니다.
    stopEditing();
    await navigate({ to: '/my' });
    showToast({ variant: 'positive', message: '저장되었습니다' });
  }

  function resetProfile() {
    setValues(initialProfile);
    stopEditing();
  }

  return { isEditing, values, errors, updateValue, submitProfile, resetProfile };
}
