const MONTH_LABELS = [
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

/** ISO 날짜 문자열을 디자인 형식(`Feb 17. 2025.`)으로 바꾼다. */
export const formatDate = (isoDate: string) => {
  const date = new Date(isoDate);
  return `${MONTH_LABELS[date.getMonth()]} ${date.getDate()}. ${date.getFullYear()}.`;
};
