const HOUR_IN_MILLISECONDS = 60 * 60 * 1000;
const DAY_IN_MILLISECONDS = 24 * HOUR_IN_MILLISECONDS;
const MONTH_NAMES = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
] as const;

/** 생년월일 입력값을 숫자 8자리 이내의 YYYY-MM-DD 형식으로 변환합니다. */
export function formatBirthDateInput(value: string) {
  const digits = value.replace(/\D/g, '').slice(0, 8);

  if (digits.length <= 4) {
    return digits;
  }

  if (digits.length <= 6) {
    return `${digits.slice(0, 4)}-${digits.slice(4)}`;
  }

  return `${digits.slice(0, 4)}-${digits.slice(4, 6)}-${digits.slice(6)}`;
}

/** 24시간 미만은 경과 시간으로, 이후에는 영문 날짜로 표시합니다. */
export function formatRelativeDate(value: string, now = new Date()) {
  const date = new Date(value);
  const elapsedMilliseconds = now.getTime() - date.getTime();

  if (Number.isNaN(date.getTime())) {
    return '';
  }

  if (elapsedMilliseconds < DAY_IN_MILLISECONDS) {
    const elapsedHours = Math.max(0, Math.floor(elapsedMilliseconds / HOUR_IN_MILLISECONDS));
    return `${elapsedHours}시간 전`;
  }

  const month = MONTH_NAMES[date.getMonth()];
  return `${month} ${date.getDate()}. ${date.getFullYear()}.`;
}
