import {
  isValidBirthDate,
  isValidEmail,
  isValidIntroduction,
  isValidName,
  isValidNickname,
  isValidPassword,
  LAST_AVAILABLE_BIRTH_DATE,
} from '@/shared/utils/userValidation';

export const INITIAL_REGISTRATION_VALUES = {
  email: '',
  password: '',
  passwordConfirm: '',
  name: '',
  birthDate: '',
  nickname: '',
  introduction: '',
};

export type RegistrationField = keyof typeof INITIAL_REGISTRATION_VALUES;

export function getEmailRegistrationErrors(values: typeof INITIAL_REGISTRATION_VALUES) {
  const normalizedBirthDate = values.birthDate.replaceAll(' ', '');

  return {
    email: !isValidEmail(values.email),
    password: !isValidPassword(values.password),
    passwordConfirm: values.password.length === 0 || values.password !== values.passwordConfirm,
    name: !isValidName(values.name),
    birthDate: !isValidBirthDate(normalizedBirthDate, LAST_AVAILABLE_BIRTH_DATE),
    nickname: !isValidNickname(values.nickname),
    introduction: !isValidIntroduction(values.introduction),
  };
}
