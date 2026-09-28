const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const BIRTH_DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

export const isEmail = (value: string) => EMAIL_PATTERN.test(value);

export const isBirthDate = (value: string) => {
  if (!BIRTH_DATE_PATTERN.test(value)) return false;
  const date = new Date(value);
  return !Number.isNaN(date.getTime()) && date <= new Date();
};

export const isBlank = (value: string) => value.trim().length === 0;
