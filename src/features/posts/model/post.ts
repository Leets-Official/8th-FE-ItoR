export type PostContentBlock =
  | { type: 'text'; text: string }
  | { type: 'image'; src: string; alt: string; width: number; height: number };

export interface Post {
  id: string;
  title: string;
  subtitle?: string;
  summary: string;
  content: PostContentBlock[];
  author: { id?: string; nickname: string; avatarUrl?: string; introduction?: string };
  publishedAt: string;
  commentCount: number;
  thumbnailUrl?: string;
}

export const POSTS_PER_PAGE = 10;
