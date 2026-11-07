import { apiClient } from '@/shared/api/apiClient';
import type { ApiResponse } from '@/shared/api/apiTypes';
import type { ContentDto } from '@/shared/api/postApi';

export type CommentGetDto = {
  commentId?: number;
  content?: string;
  nickName?: string;
  profileUrl?: string;
  createdAt?: string;
  isOwner?: boolean;
};

export type PostReadResponse = {
  postId?: string;
  title?: string;
  contents?: ContentDto[];
  isOwner?: boolean;
  comments?: CommentGetDto[];
  nickName?: string;
  profileUrl?: string;
  introduction?: string;
  createdAt?: string;
};

export type CommentCreateDto = {
  content: string;
};

export type CommentUpdateDto = {
  content: string;
};

/** 로그인 여부에 따라 소유권 정보가 포함된 게시글 상세를 조회합니다. */
export async function getPost(postId: string, hasAccessToken: boolean, signal?: AbortSignal) {
  const endpoint = hasAccessToken ? '/posts/token' : '/posts';
  const response = await apiClient.get<ApiResponse<PostReadResponse>>(endpoint, {
    params: { postId },
    signal,
    timeout: 10_000,
  });

  return response.data.data;
}

/** 로그인 사용자가 게시글에 댓글을 작성합니다. */
export async function postComment(postId: string, commentCreateDto: CommentCreateDto) {
  await apiClient.post<ApiResponse<void>>(`/comments/${postId}`, commentCreateDto);
}

/** 작성자 본인의 댓글을 삭제합니다. */
export async function deleteComment(commentId: number) {
  await apiClient.delete<ApiResponse<void>>(`/comments/${commentId}`);
}

/** 작성자 본인의 댓글 내용을 수정합니다. */
export async function patchComment(commentId: number, commentUpdateDto: CommentUpdateDto) {
  await apiClient.patch<ApiResponse<void>>(`/comments/${commentId}`, commentUpdateDto);
}

/** 작성자 본인의 게시글을 삭제합니다. */
export async function deletePost(postId: string) {
  await apiClient.delete<ApiResponse<void>>('/posts', { params: { postId } });
}
