import type { User } from '@/shared/types/user';

export type CommentAuthor = Pick<User, 'nickname' | 'avatarUrl'> & { id?: string };

export interface PostComment {
  id: string;
  author: CommentAuthor;
  content: string;
  createdAt: string;
  isOwner: boolean;
}
