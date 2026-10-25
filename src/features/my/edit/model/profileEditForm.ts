import {
  isValidBirthDate,
  isValidEmail,
  isValidIntroduction,
  isValidNickname,
  isValidPassword,
} from '@/shared/utils/userValidation';

export const INITIAL_PROFILE_EDIT_VALUES = {
  nickname: '',
  introduction: '',
  email: '',
  password: '',
  passwordConfirm: '',
  name: '',
  birthDate: '',
};

export type ProfileEditValues = typeof INITIAL_PROFILE_EDIT_VALUES;
export type ProfileEditField = keyof ProfileEditValues;

export function getProfileEditErrors(values: ProfileEditValues) {
  return {
    nickname: !isValidNickname(values.nickname),
    introduction: !isValidIntroduction(values.introduction),
    email: !isValidEmail(values.email),
    password: values.password.length > 0 && !isValidPassword(values.password),
    passwordConfirm:
      (values.password.length > 0 || values.passwordConfirm.length > 0) &&
      values.password !== values.passwordConfirm,
    birthDate: !isValidBirthDate(values.birthDate),
  };
}
