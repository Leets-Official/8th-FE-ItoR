import type { PostComment } from './types';
import type { User } from '@/features/user';

// 댓글 API 연동 전이라 메모리에 둔 목업 저장소로 응답한다 (새로고침하면 초기화)
// 연동할 때는 함수 시그니처를 그대로 두고 본문만 @/shared/api/instance의 api 호출로 바꾼다
const mockCommentStore = new Map<number, PostComment[]>();

export async function getComments(postId: number): Promise<PostComment[]> {
  return [...(mockCommentStore.get(postId) ?? [])];
}

interface CreateCommentParams {
  postId: number;
  content: string;
  // 실제 API에서는 서버가 인증 정보로 작성자를 정하므로 목업에서만 넘긴다
  author: User;
}

export async function createComment({
  postId,
  content,
  author,
}: CreateCommentParams): Promise<PostComment> {
  const comment: PostComment = {
    id: Date.now(),
    author,
    content,
    createdAt: new Date().toISOString(),
  };
  mockCommentStore.set(postId, [...(mockCommentStore.get(postId) ?? []), comment]);
  return comment;
}

interface DeleteCommentParams {
  postId: number;
  commentId: number;
}

export async function deleteComment({ postId, commentId }: DeleteCommentParams): Promise<void> {
  mockCommentStore.set(
    postId,
    (mockCommentStore.get(postId) ?? []).filter((comment) => comment.id !== commentId),
  );
}
