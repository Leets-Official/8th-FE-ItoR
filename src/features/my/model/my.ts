import type { ContentDto, PostSummaryResponse } from '@/shared/api/postApi';

export type MyPost = {
  postId: string;
  title: string;
  subtitle: string;
  nickName: string;
  profileUrl?: string;
  createdAt: string;
  commentCount: number;
  thumbnailUrl?: string;
};

function getOrderedContents(contents: ContentDto[]) {
  return contents.toSorted((a, b) => a.contentOrder - b.contentOrder);
}

/** API 게시글을 마이페이지 목록에 표시할 데이터로 변환합니다. */
export function createMyPost(post: PostSummaryResponse): MyPost {
  const contents = getOrderedContents(post.contents ?? []);
  const subtitle = contents
    .filter((content) => content.contentType === 'TEXT')
    .map((content) => content.content.trim())
    .filter(Boolean)
    .join(' ');
  const thumbnailUrl = contents.find(
    (content) => content.contentType === 'IMAGE' && content.content,
  )?.content;

  return {
    postId: post.postId ?? '',
    title: post.title ?? '',
    subtitle,
    nickName: post.nickName ?? '',
    profileUrl: post.profileUrl || undefined,
    createdAt: post.createdAt ?? '',
    commentCount: post.commentCount ?? 0,
    thumbnailUrl,
  };
}
