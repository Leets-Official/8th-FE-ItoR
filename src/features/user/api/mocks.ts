import type { User } from '../model/types';

// API 연동 전까지 게시글·댓글 작성자로 쓰는 목업 사용자. 첫 번째는 auth 목업 계정과 같은 사람이다
export const MOCK_USERS = [
  { nickname: '닉네임', introduction: '한 줄 소개' },
  { nickname: '깃로거', introduction: '매일 커밋하는 개발자' },
  { nickname: '프론트개발자', introduction: 'React와 TypeScript를 좋아합니다' },
] satisfies (User & { introduction: string })[];
