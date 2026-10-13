import { useState } from 'react';

import type { PostComment } from './comment';
import { previewComments } from './previewComments';

export function usePreviewComments() {
  const [commentsByPost, setCommentsByPost] = useState<Record<string, PostComment[]>>({
    '2': previewComments,
    preview: previewComments,
  });

  function setPostComments(postId: string, comments: PostComment[]) {
    setCommentsByPost((previous) => ({ ...previous, [postId]: comments }));
  }

  return { commentsByPost, setPostComments };
}
