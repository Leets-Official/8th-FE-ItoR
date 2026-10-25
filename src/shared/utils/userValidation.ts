export const EMAIL_PATTERN = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
export const PASSWORD_PATTERN = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,64}$/;
export const NAME_PATTERN = /^[가-힣]*$/;
export const NICKNAME_PATTERN = /^[a-zA-Z0-9]+$/;
export const BIRTH_DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

export const NAME_MAX_LENGTH = 20;
export const NICKNAME_MIN_LENGTH = 3;
export const NICKNAME_MAX_LENGTH = 20;
export const INTRODUCTION_MAX_LENGTH = 30;
export const LAST_AVAILABLE_BIRTH_DATE = '2025-03-16';

export function isValidEmail(value: string) {
  return EMAIL_PATTERN.test(value);
}

export function isValidPassword(value: string) {
  return PASSWORD_PATTERN.test(value);
}

export function isValidName(value: string) {
  return value.trim().length > 0 && value.length <= NAME_MAX_LENGTH && NAME_PATTERN.test(value);
}

export function isValidNickname(value: string) {
  return (
    value.length >= NICKNAME_MIN_LENGTH &&
    value.length <= NICKNAME_MAX_LENGTH &&
    NICKNAME_PATTERN.test(value)
  );
}

export function isValidBirthDate(value: string, lastAvailableBirthDate?: string) {
  return (
    BIRTH_DATE_PATTERN.test(value) && (!lastAvailableBirthDate || value <= lastAvailableBirthDate)
  );
}

export function isValidIntroduction(value: string) {
  return value.length <= INTRODUCTION_MAX_LENGTH;
}
