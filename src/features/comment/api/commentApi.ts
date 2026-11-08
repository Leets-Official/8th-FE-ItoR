import { api } from '@/shared/api/instance';
import type { PostComment } from '../model/types';

// 댓글 목록 API는 따로 없고, 게시글 상세 응답의 comments에 이 형태로 담겨 온다
export interface CommentResponse {
  commentId: number;
  content: string;
  nickName: string;
  profileUrl?: string | null;
  createdAt: string;
  // 토큰을 붙여 게시글을 조회했을 때만 내 댓글인지 알려준다
  isOwner: boolean;
}

export function toPostComment({
  commentId,
  content,
  nickName,
  profileUrl,
  createdAt,
  isOwner,
}: CommentResponse): PostComment {
  return {
    id: commentId,
    author: { nickname: nickName, profileImageUrl: profileUrl || undefined },
    content,
    createdAt,
    isOwner,
  };
}

interface CreateCommentParams {
  postId: string;
  content: string;
}

// 작성자는 서버가 토큰으로 정한다
export async function createComment({ postId, content }: CreateCommentParams) {
  await api.post(`/comments/${postId}`, { content });
}

export async function deleteComment(commentId: number) {
  await api.delete(`/comments/${commentId}`);
}
