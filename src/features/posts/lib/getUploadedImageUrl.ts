export function getUploadedImageUrl(presignedUrl: string): string {
  const url = new URL(presignedUrl);
  if (
    url.protocol !== 'https:' ||
    url.username ||
    url.password ||
    !/(^|\.)s3(?:[.-][a-z0-9-]+)*\.amazonaws\.com$/i.test(url.hostname)
  ) {
    throw new Error('사진 업로드 주소를 확인할 수 없습니다. 다시 시도해주세요.');
  }
  // shortcut: 공개 S3 객체 URL을 사용한다. CDN·비공개 버킷이면 서버의 최종 URL 계약으로 변경한다.
  url.search = '';
  url.hash = '';
  return url.href;
}
