import type { DetailComment, DetailViewer } from '../model/detail';

export const DETAIL_COMMENTS_MOCK: readonly DetailComment[] = [
  {
    id: 'comment-1',
    nickname: '닉네임',
    date: 'Feb 17.2025.',
    content: '댓글 표시되는 곳',
    isOwned: true,
  },
];

export const DETAIL_VIEWER_MOCK: DetailViewer = {
  nickname: '닉네임',
};
