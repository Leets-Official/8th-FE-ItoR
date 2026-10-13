const HOUR = 60 * 60 * 1000;

export function formatPublishedTime(publishedAt: string, now = Date.now()): string {
  const date = new Date(publishedAt);
  if (Number.isNaN(date.getTime())) return '날짜 정보 없음';

  const elapsed = Math.max(0, now - date.getTime());
  if (elapsed < HOUR) {
    const minutes = Math.floor(elapsed / 60000);
    return minutes === 0 ? '방금 전' : `${minutes}분전`;
  }
  if (elapsed < 24 * HOUR) return `${Math.floor(elapsed / HOUR)}시간전`;

  const parts = new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    timeZone: 'Asia/Seoul',
  }).formatToParts(date);
  const part = (type: Intl.DateTimeFormatPartTypes) =>
    parts.find((item) => item.type === type)?.value;
  return `${part('month')} ${part('day')}. ${part('year')}.`;
}
