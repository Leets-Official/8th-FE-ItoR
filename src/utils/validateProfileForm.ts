import {
  INTRODUCTION_MAX_LENGTH,
  NICKNAME_MAX_LENGTH,
  PASSWORD_MIN_LENGTH,
  VALIDATION_MESSAGE,
} from '@/constants/validation';
import { isBirthDate, isBlank, isEmail } from './validators';

export interface ProfileFormValues {
  email: string;
  password: string;
  passwordConfirm: string;
  name: string;
  birthDate: string;
  nickname: string;
  introduction: string;
}

export type ProfileFormErrors = Partial<Record<keyof ProfileFormValues, string>>;

interface ValidateOptions {
  /** 카카오 가입이면 비밀번호를 받지 않는다. */
  requiresPassword: boolean;
  /** 설정 페이지에서는 비밀번호를 비워두면 변경하지 않는다. */
  isPasswordOptional?: boolean;
}

/** 회원가입과 프로필 설정 폼이 함께 쓰는 입력값 검사. 에러가 없으면 빈 객체를 돌려준다. */
export const validateProfileForm = (
  values: ProfileFormValues,
  { requiresPassword, isPasswordOptional = false }: ValidateOptions,
): ProfileFormErrors => {
  const errors: ProfileFormErrors = {};

  if (isBlank(values.email)) errors.email = VALIDATION_MESSAGE.REQUIRED;
  else if (!isEmail(values.email)) errors.email = VALIDATION_MESSAGE.INVALID_EMAIL;

  const shouldCheckPassword = requiresPassword && !(isPasswordOptional && values.password === '');
  if (shouldCheckPassword) {
    if (values.password.length < PASSWORD_MIN_LENGTH)
      errors.password = VALIDATION_MESSAGE.PASSWORD_TOO_SHORT;
    if (values.password !== values.passwordConfirm)
      errors.passwordConfirm = VALIDATION_MESSAGE.PASSWORD_MISMATCH;
  }

  if (isBlank(values.name)) errors.name = VALIDATION_MESSAGE.REQUIRED;

  if (!isBirthDate(values.birthDate)) errors.birthDate = VALIDATION_MESSAGE.INVALID_BIRTH_DATE;

  if (isBlank(values.nickname)) errors.nickname = VALIDATION_MESSAGE.REQUIRED;
  else if (values.nickname.length > NICKNAME_MAX_LENGTH)
    errors.nickname = VALIDATION_MESSAGE.NICKNAME_TOO_LONG;

  if (values.introduction.length > INTRODUCTION_MAX_LENGTH)
    errors.introduction = VALIDATION_MESSAGE.INTRODUCTION_TOO_LONG;

  return errors;
};

export const hasErrors = (errors: ProfileFormErrors) => Object.keys(errors).length > 0;
