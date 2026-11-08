import type { User } from '@/features/user';

// DOM 전역 타입 Comment와 겹치지 않게 PostComment로 이름 짓는다
export interface PostComment {
  id: number;
  author: User;
  content: string;
  createdAt: string;
  // 로그인한 사용자가 쓴 댓글이면 true. 삭제 메뉴를 보여줄지 정한다
  isOwner: boolean;
}
