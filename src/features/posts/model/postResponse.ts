export interface PostContentResponse {
  contentOrder: number;
  content: string;
  contentType: 'TEXT' | 'IMAGE';
}

export interface PostSummaryResponse {
  postId: string;
  title: string;
  nickName: string;
  profileUrl?: string | null;
  createdAt: string;
  commentCount: number;
  contents: PostContentResponse[];
}

export interface PostListResponse {
  posts: PostSummaryResponse[];
  pageMax: number;
}

export interface PostCommentResponse {
  commentId: number;
  content: string;
  nickName: string;
  profileUrl?: string | null;
  createdAt: string;
  isOwner: boolean;
}

export interface PostDetailResponse {
  postId: string;
  title: string;
  contents: PostContentResponse[];
  isOwner: boolean;
  comments: PostCommentResponse[];
  nickName: string;
  profileUrl?: string | null;
  introduction?: string | null;
  createdAt: string;
}

export interface PostListParams {
  page: number;
  size: number;
}
