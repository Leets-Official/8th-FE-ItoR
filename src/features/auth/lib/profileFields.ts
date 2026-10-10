import type { SocialProvider } from '../model/types';

// 회원가입과 프로필 수정이 같은 조건으로 검사하는 항목 (이메일·비밀번호는 각 폼에서 검사한다)
export type ProfileField = 'name' | 'birthDate' | 'nickname' | 'introduction';
export type ProfileFieldErrors = Partial<Record<ProfileField, string>>;

export const NAME_MAX_LENGTH = 10;
export const NICKNAME_MAX_LENGTH = 20;
export const INTRODUCTION_MAX_LENGTH = 30;

export const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const BIRTH_DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

// 시안 플로우의 "조건이 맞지 않는 폼" 문구. 로그인 모달과 같은 "*…." 형식으로 맞춘다
export const PROFILE_ERROR_MESSAGE = {
  required: '*반드시 입력해야하는 필수 사항입니다.',
  invalidEmail: '*이메일 형식이 적합하지 않습니다.',
  duplicateEmail: '*사용중인 이메일입니다.',
  nameTooLong: `*이름은 최대 ${NAME_MAX_LENGTH}글자 입니다.`,
  invalidBirthDate: '*생년월일 형식이 적합하지 않습니다.',
  nicknameTooLong: `*닉네임은 최대 ${NICKNAME_MAX_LENGTH}글자 입니다.`,
  introductionTooLong: `* 한 줄 소개는 최대 ${INTRODUCTION_MAX_LENGTH}글자입니다.`,
  passwordMismatch: '*비밀번호가 일치하지 않습니다.',
};

export const SOCIAL_PROVIDER_LABEL: Record<SocialProvider, string> = {
  kakao: '카카오 로그인',
};

// 한 줄 소개는 선택 항목
const REQUIRED_PROFILE_FIELDS: ProfileField[] = ['name', 'birthDate', 'nickname'];

// 조건이 맞지 않는 칸마다 하나의 문구를 돌려준다. 빈 칸이면 길이·형식 문구 대신 필수 문구를 보여준다
export function validateProfile(values: Record<ProfileField, string>): ProfileFieldErrors {
  const errors: ProfileFieldErrors = {};
  REQUIRED_PROFILE_FIELDS.forEach((field) => {
    if (!values[field]) errors[field] = PROFILE_ERROR_MESSAGE.required;
  });

  if (!errors.name && values.name.length > NAME_MAX_LENGTH) {
    errors.name = PROFILE_ERROR_MESSAGE.nameTooLong;
  }
  if (!errors.birthDate && !BIRTH_DATE_PATTERN.test(values.birthDate)) {
    errors.birthDate = PROFILE_ERROR_MESSAGE.invalidBirthDate;
  }
  if (!errors.nickname && values.nickname.length > NICKNAME_MAX_LENGTH) {
    errors.nickname = PROFILE_ERROR_MESSAGE.nicknameTooLong;
  }
  if (values.introduction.length > INTRODUCTION_MAX_LENGTH) {
    errors.introduction = PROFILE_ERROR_MESSAGE.introductionTooLong;
  }
  return errors;
}

// 숫자만 남기고 YYYY-MM-DD 모양으로 하이픈을 끼워 넣는다
export function formatBirthDate(value: string) {
  const digits = value.replace(/\D/g, '').slice(0, 8);
  return [digits.slice(0, 4), digits.slice(4, 6), digits.slice(6, 8)].filter(Boolean).join('-');
}

// 새로고침 후에도 사이드바 프로필에 보이도록 object URL 대신 data URL로 바꿔 보관한다
export function readAsDataUrl(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}
