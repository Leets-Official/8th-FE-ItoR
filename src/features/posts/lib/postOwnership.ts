import type { User } from '@/shared/types/user';

import type { Post } from '../model/post';

export function isPostAuthor(post: Post | undefined, user: User | null): boolean {
  return user !== null && post?.author.id === user.id;
}
