export const NICKNAME_MAX_LENGTH = 20;
export const INTRODUCTION_MAX_LENGTH = 30;
export const PASSWORD_MIN_LENGTH = 8;

export const VALIDATION_MESSAGE = {
  REQUIRED: '반드시 입력하셔야 하는 필수 사항입니다.',
  INVALID_EMAIL: '이메일 형식이 올바르지 않습니다.',
  PASSWORD_TOO_SHORT: `비밀번호는 ${PASSWORD_MIN_LENGTH}자 이상 입력해주세요.`,
  PASSWORD_MISMATCH: '비밀번호가 일치하지 않습니다.',
  INVALID_BIRTH_DATE: 'YYYY-MM-DD 형식으로 입력해주세요.',
  NICKNAME_TOO_LONG: `닉네임은 최대 ${NICKNAME_MAX_LENGTH}글자입니다.`,
  INTRODUCTION_TOO_LONG: `한 줄 소개는 최대 ${INTRODUCTION_MAX_LENGTH}글자입니다.`,
} as const;
