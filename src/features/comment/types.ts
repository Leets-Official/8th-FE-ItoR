import type { User } from '@/features/user';

// DOM 전역 타입 Comment와 겹치지 않게 PostComment로 이름 짓는다
export interface PostComment {
  id: number;
  author: User;
  content: string;
  createdAt: string;
}
