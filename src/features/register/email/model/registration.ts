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

export const LAST_AVAILABLE_BIRTH_DATE = '2025-03-16';
export const BIRTH_DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;
