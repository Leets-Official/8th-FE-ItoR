import { useState } from 'react';

import type { User } from '@/shared/types/user';
import { getCurrentAuthor } from '@/shared/utils/getCurrentAuthor';

import { buildPostFields, getPostDraftError } from '../lib/postDraft';
import { isPostAuthor } from '../lib/postOwnership';
import type { Post } from './post';
import type { PostDraft } from './postDraft';
import { previewPosts } from './previewPosts';

export function usePreviewPosts(currentUser: User | null, users: readonly User[]) {
  const [posts, setPosts] = useState(previewPosts);

  function publishPost(draft: PostDraft): Post | null {
    if (!currentUser || getPostDraftError(draft)) return null;
    const post: Post = {
      ...buildPostFields(draft),
      id: crypto.randomUUID(),
      author: currentUser,
      publishedAt: new Date().toISOString(),
      commentCount: 0,
    };
    setPosts((previous) => [post, ...previous]);
    return post;
  }

  function updatePost(id: string, draft: PostDraft): Post | null {
    const post = posts.find((item) => item.id === id);
    if (!post || !isPostAuthor(post, currentUser) || getPostDraftError(draft)) return null;
    const updated = { ...post, ...buildPostFields(draft) };
    setPosts((previous) => previous.map((item) => (item.id === id ? updated : item)));
    return updated;
  }

  function deletePost(id: string): boolean {
    if (
      !isPostAuthor(
        posts.find((item) => item.id === id),
        currentUser,
      )
    )
      return false;
    setPosts((previous) => previous.filter((item) => item.id !== id));
    return true;
  }

  return {
    posts: posts.map((post) => ({
      ...post,
      author: getCurrentAuthor(post.author.id, users) ?? post.author,
    })),
    publishPost,
    updatePost,
    deletePost,
  };
}
