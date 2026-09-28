import type { Comment } from '@/types/comment';
import { MOCK_CURRENT_USER, MOCK_OTHER_AUTHOR } from './users';

/** 댓글 수만큼 더미 댓글을 만든다. 첫 번째 댓글은 로그인 사용자가 쓴 것으로 둔다. */
export const createMockComments = (count: number): Comment[] =>
  Array.from({ length: count }, (_, index) => ({
    id: index + 1,
    content: `${index + 1}번째 댓글입니다. Lorem Ipsum is simply dummy text of the printing and typesetting industry.`,
    author: index === 0 ? MOCK_CURRENT_USER : MOCK_OTHER_AUTHOR,
    createdAt: new Date(2025, 1, 17).toISOString(),
  }));
