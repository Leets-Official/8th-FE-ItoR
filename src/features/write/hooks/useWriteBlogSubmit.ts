import type { FormEvent } from 'react';
import { useNavigate } from '@tanstack/react-router';

import { useToast } from '@/shared/ui/toast/hooks/useToast';

/** @returns 필수 입력값 검사와 임시 게시 동작을 수행하는 함수 */
export function useWriteBlogSubmit() {
  const navigate = useNavigate();
  const { showToast } = useToast();

  async function submitWriteBlog(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const title = String(formData.get('title') ?? '').trim();
    const content = formData
      .getAll('content')
      .map((value) => String(value))
      .join('')
      .trim();

    if (!title) {
      showToast({ variant: 'negative', message: '제목을 입력해주세요' });
      return;
    }

    if (!content) {
      showToast({ variant: 'negative', message: '본문 내용을 입력해주세요' });
      return;
    }

    // TODO(API): 생성 요청 성공 후 반환된 게시글 ID의 상세 페이지로 이동합니다.
    await navigate({ to: '/detail' });
    showToast({ variant: 'positive', message: '저장되었습니다!' });
  }

  return { submitWriteBlog };
}
