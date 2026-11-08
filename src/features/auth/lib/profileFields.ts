import type { SocialProvider } from '../model/types';

// 회원가입과 프로필 수정이 같은 조건으로 검사하는 항목 (이메일·비밀번호는 각 폼에서 검사한다)
export type ProfileField = 'name' | 'birthDate' | 'nickname' | 'introduction';
export type ProfileFieldErrors = Partial<Record<ProfileField, string>>;

export const NAME_MAX_LENGTH = 10;
export const NICKNAME_MAX_LENGTH = 20;
export const INTRODUCTION_MAX_LENGTH = 30;

export const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
// 서버 검증(회원가입·프로필 수정·비밀번호 변경 요청)과 같은 조건. 미리 막아 400 응답이 나지 않게 한다
export const PASSWORD_PATTERN = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,64}$/;
const NICKNAME_PATTERN = /^[a-zA-Z0-9]{3,}$/;
const NAME_PATTERN = /^[가-힣]+$/;
const BIRTH_DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;
// 이보다 앞선 연도는 오타로 본다
const BIRTH_YEAR_MIN = 1900;

// 시안 플로우의 "조건이 맞지 않는 폼" 문구. 로그인 모달과 같은 "*…." 형식으로 맞춘다
export const PROFILE_ERROR_MESSAGE = {
  required: '*반드시 입력해야하는 필수 사항입니다.',
  invalidEmail: '*이메일 형식이 적합하지 않습니다.',
  duplicateEmail: '*사용중인 이메일입니다.',
  nameTooLong: `*이름은 최대 ${NAME_MAX_LENGTH}글자 입니다.`,
  invalidName: '*이름은 한글만 입력할 수 있습니다.',
  invalidBirthDate: '*생년월일 형식이 적합하지 않습니다.',
  invalidBirthDay: '*유효한 일을 입력하세요.',
  invalidBirthMonth: '*유효한 월을 입력하세요.',
  invalidBirthYear: '*유효한 연도를 입력하세요.',
  futureBirthDate: '*유효한 생년월일을 입력하세요.',
  nicknameTooLong: `*닉네임은 최대 ${NICKNAME_MAX_LENGTH}글자 입니다.`,
  invalidNickname: '*닉네임은 영문, 숫자로 3글자 이상 입력하세요.',
  introductionTooLong: `* 한 줄 소개는 최대 ${INTRODUCTION_MAX_LENGTH}글자입니다.`,
  invalidPassword: '*비밀번호는 영문, 숫자, 특수문자(@$!%*?&)를 모두 포함해 8~64글자로 입력하세요.',
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
  } else if (!errors.name && !NAME_PATTERN.test(values.name)) {
    errors.name = PROFILE_ERROR_MESSAGE.invalidName;
  }
  if (!errors.birthDate && !BIRTH_DATE_PATTERN.test(values.birthDate)) {
    errors.birthDate = PROFILE_ERROR_MESSAGE.invalidBirthDate;
  } else if (!errors.birthDate) {
    const birthDateError = getBirthDateError(values.birthDate);
    if (birthDateError) errors.birthDate = birthDateError;
  }
  if (!errors.nickname && values.nickname.length > NICKNAME_MAX_LENGTH) {
    errors.nickname = PROFILE_ERROR_MESSAGE.nicknameTooLong;
  } else if (!errors.nickname && !NICKNAME_PATTERN.test(values.nickname)) {
    errors.nickname = PROFILE_ERROR_MESSAGE.invalidNickname;
  }
  if (values.introduction.length > INTRODUCTION_MAX_LENGTH) {
    errors.introduction = PROFILE_ERROR_MESSAGE.introductionTooLong;
  }
  return errors;
}

// YYYY-MM-DD 형식이 맞은 뒤 일 → 월 → 연도 순서로 보고, 처음 틀린 부분의 문구를 돌려준다
function getBirthDateError(birthDate: string, today = new Date()) {
  const [year, month, day] = birthDate.split('-').map(Number);
  const isMonthValid = month >= 1 && month <= 12;
  // 월이 맞으면 그 달의 마지막 날(윤년 2월 29일 포함)까지, 월이 틀렸으면 31일까지 허용한다
  const lastDay = isMonthValid ? new Date(year, month, 0).getDate() : 31;

  if (day < 1 || day > lastDay) return PROFILE_ERROR_MESSAGE.invalidBirthDay;
  if (!isMonthValid) return PROFILE_ERROR_MESSAGE.invalidBirthMonth;
  if (year < BIRTH_YEAR_MIN || year > today.getFullYear()) {
    return PROFILE_ERROR_MESSAGE.invalidBirthYear;
  }
  // 올해지만 아직 오지 않은 날짜는 어느 한 부분이 틀렸다고 하기 어려워 전체 문구로 알린다
  if (new Date(year, month - 1, day) > today) return PROFILE_ERROR_MESSAGE.futureBirthDate;
  return undefined;
}

// 숫자만 남기고 YYYY-MM-DD 모양으로 하이픈을 끼워 넣는다
export function formatBirthDate(value: string) {
  const digits = value.replace(/\D/g, '').slice(0, 8);
  return [digits.slice(0, 4), digits.slice(4, 6), digits.slice(6, 8)].filter(Boolean).join('-');
}
