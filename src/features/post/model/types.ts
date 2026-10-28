import type { PostComment } from '@/features/comment';
import type { User } from '@/features/user';

export interface PostAuthor extends User {
  introduction?: string;
}

export interface PostSummary {
  // 서버가 UUID로 준다
  id: string;
  title: string;
  excerpt: string;
  author: PostAuthor;
  createdAt: string;
  commentCount: number;
  thumbnailUrl?: string;
}

// 본문은 글과 사진이 번갈아 나오는 블록 목록
export type PostContentBlock = { type: 'text'; text: string } | { type: 'image'; imageUrl: string };

export interface PostDetail extends PostSummary {
  content: PostContentBlock[];
  // 로그인한 사용자가 쓴 글이면 true. 수정·삭제 버튼을 보여줄지 정한다
  isOwner: boolean;
  // 댓글 목록 API가 따로 없어 상세 응답에 담겨 온다
  comments: PostComment[];
}

// 글쓰기에서 게시하기를 누르면 넘기는 값. 작성자·작성일은 저장하는 쪽에서 붙인다
export interface PostCreateInput {
  title: string;
  content: PostContentBlock[];
}
