import { useState } from 'react';

import type { User } from '@/shared/types/user';

import { buildPostContent, getPostDraftError } from '../lib/postDraft';
import type { Post } from './post';
import type { PostDraft } from './postDraft';
import { previewPosts } from './previewPosts';

export function usePreviewPosts(currentUser: User | null) {
  const [posts, setPosts] = useState(previewPosts);

  function publishPost(draft: PostDraft): Post | null {
    if (!currentUser || getPostDraftError(draft)) return null;
    const content = buildPostContent(draft.blocks);
    const post: Post = {
      id: crypto.randomUUID(),
      title: draft.title.trim(),
      summary: content
        .filter((block) => block.type === 'text')
        .map((block) => block.text)
        .join(' '),
      content,
      author: currentUser,
      publishedAt: new Date().toISOString(),
      commentCount: 0,
      thumbnailUrl: content.find((block) => block.type === 'image')?.src,
    };
    setPosts((previous) => [post, ...previous]);
    return post;
  }

  return { posts, publishPost };
}
