import { useState } from 'react';

import type { User } from '@/shared/types/user';
import { getCurrentAuthor } from '@/shared/utils/getCurrentAuthor';

import type { PostComment } from './comment';
import { previewComments } from './previewComments';

export function usePreviewComments(users: readonly User[]) {
  const [commentsByPost, setCommentsByPost] = useState<Record<string, PostComment[]>>({
    '2': previewComments,
    preview: previewComments,
  });

  function setPostComments(postId: string, comments: PostComment[]) {
    setCommentsByPost((previous) => ({ ...previous, [postId]: comments }));
  }

  return {
    commentsByPost: Object.fromEntries(
      Object.entries(commentsByPost).map(([postId, comments]) => [
        postId,
        comments.map((comment) => ({
          ...comment,
          author: getCurrentAuthor(comment.author.id, users) ?? comment.author,
        })),
      ]),
    ),
    setPostComments,
  };
}
