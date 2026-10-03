export interface PostAuthor {
  nickname: string;
  profileImageUrl?: string;
  introduction?: string;
}

export interface PostSummary {
  id: number;
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
}
