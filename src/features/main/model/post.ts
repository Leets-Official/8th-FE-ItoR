import type { ContentDto, PostSummaryResponse } from '@/shared/api/postApi';

export type MainPost = {
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

/** API 게시물 본문에서 목록에 표시할 텍스트 요약과 첫 이미지를 추출합니다. */
export function createMainPost(post: PostSummaryResponse): MainPost {
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
