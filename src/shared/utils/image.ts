/** 외부 이미지의 HTTP 주소를 HTTPS로 보정해 혼합 콘텐츠를 방지합니다. */
export function toSecureImageUrl(url: string) {
  return url.startsWith('http://') ? `https://${url.slice('http://'.length)}` : url;
}
