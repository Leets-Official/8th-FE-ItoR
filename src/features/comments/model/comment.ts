import type { User } from '@/shared/types/user';

export type CommentAuthor = User;

export interface PostComment {
  id: string;
  author: CommentAuthor;
  content: string;
  createdAt: string;
}
