import type { Author } from './user';

/**
 * 게시물 본문은 텍스트/이미지/코드 블록의 배열이다.
 * contentOrder로 작성 순서를 기록해 두면, 조회할 때 순서 그대로 렌더링할 수 있다.
 */
export type PostContentType = 'TEXT' | 'IMAGE' | 'CODE';

export interface PostContent {
  contentOrder: number;
  type: PostContentType;
  value: string;
}

export interface PostSummary {
  id: number;
  title: string;
  preview: string;
  thumbnailUrl: string | null;
  author: Author;
  createdAt: string;
  commentCount: number;
}

export interface PostDetail extends Omit<PostSummary, 'preview' | 'thumbnailUrl'> {
  contents: PostContent[];
}
