import { PREVIEW_USER } from '@/shared/mocks/previewUser';

import type { PostComment } from './comment';

// ponytail: API 연결 전 댓글 미리보기. 실제 댓글 조회와 로그인 사용자 정보로 교체한다.
export const previewComments: PostComment[] = [
  {
    id: 'preview-comment-1',
    author: PREVIEW_USER,
    content:
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.",
    createdAt: '2025-02-17T00:00:00+09:00',
  },
  {
    id: 'preview-comment-2',
    author: { id: 'another-member', nickname: '다른 닉네임' },
    content:
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.",
    createdAt: '2025-02-17T01:00:00+09:00',
  },
];
