const HOUR_IN_MS = 60 * 60 * 1000;

export function formatPostDate(isoDate: string, now = Date.now()) {
  const date = new Date(isoDate);
  const elapsedHours = Math.floor(Math.max(0, now - date.getTime()) / HOUR_IN_MS);

  if (elapsedHours < 1) {
    return '방금 전';
  }

  if (elapsedHours < 24) {
    return `${elapsedHours}시간 전`;
  }

  const month = date.toLocaleString('en-US', { month: 'short' });
  return `${month} ${date.getDate()}. ${date.getFullYear()}.`;
}
