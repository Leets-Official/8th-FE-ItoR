import { apiClient } from './apiClient';
import type { ApiResponse } from './apiTypes';

export type ContentDto = {
  contentOrder: number;
  content: string;
  contentType: 'TEXT' | 'IMAGE';
};

export type PostSummaryResponse = {
  postId?: string;
  title?: string;
  nickName?: string;
  profileUrl?: string;
  createdAt?: string;
  commentCount?: number;
  contents?: ContentDto[];
};

export type PostReadAllResponse = {
  posts?: PostSummaryResponse[];
  pageMax?: number;
};

type GetPostPageOptions = {
  page: number;
  size: number;
  authenticated: boolean;
  signal?: AbortSignal;
};

/** @returns 로그인 여부에 맞는 게시글 목록 한 페이지 */
export async function getPostPage({ page, size, authenticated, signal }: GetPostPageOptions) {
  const endpoint = authenticated ? '/posts/all/token' : '/posts/all';
  const response = await apiClient.get<ApiResponse<PostReadAllResponse>>(endpoint, {
    params: { size, page },
    signal,
    timeout: 10_000,
  });

  return response.data.data;
}
