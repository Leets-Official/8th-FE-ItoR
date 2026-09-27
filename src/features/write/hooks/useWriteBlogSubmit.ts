import type { FormEvent } from 'react';
import { useNavigate } from '@tanstack/react-router';

import { useToast } from '@/shared/ui/toast/toastContext';

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

    // TODO API 연결 후 블로그 생성이 성공하면 생성된 ID의 상세 페이지로 이동하고 저장 완료 토스트를 표시합니다.
    await navigate({ to: '/detail' });
    showToast({ variant: 'positive', message: '저장되었습니다!' });
  }

  return { submitWriteBlog };
}
