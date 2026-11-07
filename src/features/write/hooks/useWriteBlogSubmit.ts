import { useState, type FormEvent } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useQueryClient } from '@tanstack/react-query';

import { getApiErrorMessage } from '@/shared/api/apiClient';
import { postQueryKeys } from '@/shared/api/postQueryKeys';
import { useAuth } from '@/shared/auth/hooks/useAuth';
import { useToast } from '@/shared/ui/toast/hooks/useToast';

import { createPostContents } from '../api/articleUpload';
import { patchBlog, postBlog } from '../api/writeBlogApi';
import type { ArticleBlock } from '../model/article';

/** 필수 입력값 검사, 이미지 업로드와 게시글 생성을 처리합니다. */
export function useWriteBlogSubmit(blocks: readonly ArticleBlock[], postId?: string) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { auth } = useAuth();
  const { showToast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function submitWriteBlog(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (isSubmitting) {
      return;
    }

    const formData = new FormData(event.currentTarget);
    const title = String(formData.get('title') ?? '').trim();
    const hasContent = blocks.some(
      (block) => block.type === 'image' || block.content.trim().length > 0,
    );

    if (!title) {
      showToast({ variant: 'negative', message: '제목을 입력해주세요' });
      return;
    }

    if (!hasContent) {
      showToast({ variant: 'negative', message: '본문 내용을 입력해주세요' });
      return;
    }

    if (!auth) {
      showToast({ variant: 'negative', message: '로그인이 필요합니다.' });
      return;
    }

    setIsSubmitting(true);

    try {
      const contents = await createPostContents(blocks);
      const savedPostId = postId ?? (await postBlog({ title, contents }));

      if (postId) {
        await patchBlog(postId, { title, contents });
        await queryClient.invalidateQueries({ queryKey: postQueryKeys.detailRoot(postId) });
      }

      await queryClient.invalidateQueries({ queryKey: postQueryKeys.all });

      if (savedPostId) {
        await navigate({ to: '/posts/$postId', params: { postId: savedPostId } });
      } else {
        await navigate({ to: '/' });
      }

      showToast({ variant: 'positive', message: postId ? '수정되었습니다!' : '저장되었습니다!' });
    } catch (error) {
      showToast({
        variant: 'negative',
        message: getApiErrorMessage(error, '게시글을 저장하지 못했습니다.'),
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return { submitWriteBlog, isSubmitting };
}
