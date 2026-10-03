// 게시글 작성자·로그인 사용자·댓글 작성자가 공통으로 갖는 사용자 정보
export interface User {
  nickname: string;
  profileImageUrl?: string;
}
