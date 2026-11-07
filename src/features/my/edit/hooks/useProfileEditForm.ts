import { useEffect, useRef, useState, type FormEvent } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { getApiErrorMessage } from '@/shared/api/apiClient';
import { useAuth } from '@/shared/auth/hooks/useAuth';
import { useToast } from '@/shared/ui/toast/hooks/useToast';

import { getMe } from '../../api/userApi';
import { userQueryKeys } from '../../api/userQueryKeys';
import { saveProfile } from '../api/profileEditApi';
import {
  getProfileEditErrors,
  INITIAL_PROFILE_EDIT_VALUES,
  type ProfileEditField,
} from '../model/profileEditForm';
import { useProfileEditMode } from './useProfileEditMode';

export function useProfileEditForm() {
  const { isEditing, stopEditing } = useProfileEditMode();
  const { updateProfile } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const hasInitializedProfileRef = useRef(false);
  const [values, setValues] = useState(INITIAL_PROFILE_EDIT_VALUES);
  const [savedValues, setSavedValues] = useState(INITIAL_PROFILE_EDIT_VALUES);
  const [profilePicture, setProfilePicture] = useState('');
  const [savedProfilePicture, setSavedProfilePicture] = useState('');
  const [profileImageFile, setProfileImageFile] = useState<File | null>(null);
  const [apiErrorMessage, setApiErrorMessage] = useState('');
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const errors = getProfileEditErrors(values);
  const profileQuery = useQuery({ queryKey: userQueryKeys.me(), queryFn: getMe });
  const saveProfileMutation = useMutation({
    mutationFn: () =>
      saveProfile({
        values,
        savedValues,
        profilePicture,
        savedProfilePicture,
        profileImageFile,
      }),
  });

  useEffect(() => {
    if (!profileQuery.data || hasInitializedProfileRef.current) {
      return;
    }

    const profileValues = {
      nickname: profileQuery.data.nickname,
      introduction: profileQuery.data.introduction ?? '',
      email: profileQuery.data.email,
      password: '',
      passwordConfirm: '',
      name: profileQuery.data.name,
      birthDate: profileQuery.data.birthDate,
    };
    hasInitializedProfileRef.current = true;
    setValues(profileValues);
    setSavedValues(profileValues);
    setProfilePicture(profileQuery.data.profilePicture ?? '');
    setSavedProfilePicture(profileQuery.data.profilePicture ?? '');
  }, [profileQuery.data]);

  function updateValue(field: ProfileEditField, value: string) {
    setValues((currentValues) => ({ ...currentValues, [field]: value }));
  }

  async function submitProfile(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setHasSubmitted(true);

    if (
      profileQuery.isPending ||
      saveProfileMutation.isPending ||
      Object.values(errors).some(Boolean)
    ) {
      return;
    }

    setApiErrorMessage('');

    try {
      const nextProfilePicture = await saveProfileMutation.mutateAsync();
      queryClient.setQueryData(userQueryKeys.me(), (currentUser) =>
        currentUser
          ? {
              ...currentUser,
              nickname: values.nickname,
              profilePicture: nextProfilePicture || null,
              introduction: values.introduction || null,
              birthDate: values.birthDate,
            }
          : currentUser,
      );
      updateProfile({
        nickname: values.nickname,
        profilePicture: nextProfilePicture || null,
        introduction: values.introduction || null,
      });
      setSavedValues({ ...values, password: '', passwordConfirm: '' });
      setSavedProfilePicture(nextProfilePicture);
      stopEditing();
      await navigate({ to: '/my' });
      showToast({ variant: 'positive', message: '저장되었습니다' });
    } catch (error) {
      const message = getApiErrorMessage(error, '프로필 저장에 실패했습니다.');
      setApiErrorMessage(message);
      showToast({ variant: 'negative', message });
    }
  }

  function resetProfile() {
    setValues(savedValues);
    setProfilePicture(savedProfilePicture);
    setProfileImageFile(null);
    setHasSubmitted(false);
    setApiErrorMessage('');
    stopEditing();
  }

  function selectProfileImage(file: File, previewUrl: string) {
    setProfileImageFile(file);
    setProfilePicture(previewUrl);
  }

  return {
    isEditing,
    values,
    profilePicture,
    errors,
    hasSubmitted,
    isLoading: profileQuery.isPending,
    isSubmitting: saveProfileMutation.isPending,
    apiErrorMessage:
      apiErrorMessage ||
      (profileQuery.isError
        ? getApiErrorMessage(profileQuery.error, '프로필 정보를 불러오지 못했습니다.')
        : ''),
    updateValue,
    selectProfileImage,
    submitProfile,
    resetProfile,
  };
}
