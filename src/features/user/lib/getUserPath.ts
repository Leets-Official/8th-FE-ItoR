// 사용자 페이지(/users/:nickname) 주소. 닉네임에 한글·공백이 들어가므로 인코딩한다
export function getUserPath(nickname: string) {
  return `/users/${encodeURIComponent(nickname)}`;
}
