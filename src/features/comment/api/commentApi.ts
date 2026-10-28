import type { PostComment } from '../model/types';
import { MOCK_USERS, type User } from '@/features/user';

// 댓글 API 연동 전이라 메모리에 둔 목업 저장소로 응답한다 (새로고침하면 초기화)
// 연동할 때는 함수 시그니처를 그대로 두고 본문만 @/shared/api/instance의 api 호출로 바꾼다
//
// 다른 작성자의 댓글(삭제 버튼 없음)과 admin@gitlog.com 계정(MOCK_USERS[0])의 댓글(삭제 버튼 있음)을
// 함께 확인할 수 있게 1번 게시글에 미리 넣어 둔다
const mockCommentStore = new Map<number, PostComment[]>([
  [
    1,
    [
      {
        id: 1,
        author: MOCK_USERS[1],
        content: '좋은 글 잘 읽었습니다! 다음 글도 기대할게요.',
        createdAt: new Date(2025, 1, 18).toISOString(),
      },
      {
        id: 2,
        author: MOCK_USERS[2],
        content: '예시 코드 덕분에 이해가 잘 됐어요. 감사합니다.',
        createdAt: new Date(2025, 1, 19).toISOString(),
      },
      {
        id: 3,
        author: MOCK_USERS[0],
        content: '읽어 주셔서 감사합니다! 궁금한 점은 댓글로 남겨 주세요.',
        createdAt: new Date(2025, 1, 20).toISOString(),
      },
    ],
  ],
]);

// 게시글 목업이 목록·상세에 댓글 수를 채울 때 쓴다. 실제 API에서는 게시글 응답에 댓글 수가 담겨 온다
export function countMockComments(postId: number) {
  return mockCommentStore.get(postId)?.length ?? 0;
}

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
