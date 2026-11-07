import { useQuery } from '@tanstack/react-query';

import { getApiErrorMessage } from '@/shared/api/apiClient';
import { postQueryKeys } from '@/shared/api/postQueryKeys';
import { useAuth } from '@/shared/auth/hooks/useAuth';
import { getPost } from '@/features/detail/api/detailApi';

import type { ArticleBlock } from '../model/article';

function createEditableBlocks(contents: Awaited<ReturnType<typeof getPost>>['contents']) {
  const blocks: ArticleBlock[] = (contents ?? [])
    .toSorted((first, second) => (first.contentOrder ?? 0) - (second.contentOrder ?? 0))
    .map((content) => {
      if (content.contentType === 'IMAGE') {
        const src = content.content ?? '';
        return {
          id: crypto.randomUUID(),
          type: 'image' as const,
          image: { id: crypto.randomUUID(), src, alt: '게시글 이미지' },
        };
      }

      return {
        id: crypto.randomUUID(),
        type: 'text' as const,
        content: content.content ?? '',
      };
    });

  if (blocks.length === 0 || blocks.at(-1)?.type === 'image') {
    blocks.push({ id: crypto.randomUUID(), type: 'text', content: '' });
  }

  return blocks;
}

/** 수정할 게시글을 조회해 본문 편집 블록으로 변환합니다. */
export function useEditBlogPost(postId: string) {
  const { auth } = useAuth();
  const hasAccessToken = Boolean(auth?.accessToken);
  const postQuery = useQuery({
    queryKey: postQueryKeys.detail(postId, auth?.nickname ?? null),
    queryFn: ({ signal }) => getPost(postId, hasAccessToken, signal),
    enabled: hasAccessToken,
  });
  const canEdit = Boolean(postQuery.data?.isOwner);
  const editablePost =
    postQuery.data && canEdit
      ? {
          title: postQuery.data.title ?? '',
          blocks: createEditableBlocks(postQuery.data.contents),
        }
      : null;
  const errorMessage = postQuery.isError
    ? getApiErrorMessage(postQuery.error, '게시글을 불러오지 못했습니다.')
    : !hasAccessToken
      ? '로그인이 필요합니다.'
      : postQuery.data && !canEdit
        ? '작성자 본인의 게시글만 수정할 수 있습니다.'
        : '';

  return { editablePost, isLoading: postQuery.isPending && hasAccessToken, errorMessage };
}
