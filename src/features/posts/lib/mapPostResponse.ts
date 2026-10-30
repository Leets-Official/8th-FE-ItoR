import type { PostComment } from '@/features/comments/model/comment';

import type { Post, PostContentBlock } from '../model/post';
import type {
  PostContentResponse,
  PostDetailResponse,
  PostSummaryResponse,
} from '../model/postResponse';

function mapContents(contents: PostContentResponse[]): PostContentBlock[] {
  return [...contents]
    .sort((a, b) => a.contentOrder - b.contentOrder)
    .map((item) =>
      item.contentType === 'TEXT'
        ? { type: 'text', text: item.content }
        : { type: 'image', src: item.content, alt: '' },
    );
}

export function mapPostSummary(response: PostSummaryResponse): Post {
  const content = mapContents(response.contents);
  return {
    id: response.postId,
    title: response.title,
    summary: content
      .filter((block) => block.type === 'text')
      .map((block) => block.text)
      .join(' '),
    content,
    author: { nickname: response.nickName, avatarUrl: response.profileUrl ?? undefined },
    publishedAt: response.createdAt,
    commentCount: response.commentCount,
    thumbnailUrl: content.find((block) => block.type === 'image')?.src,
  };
}

export function mapPostDetail(response: PostDetailResponse) {
  const post = mapPostSummary({ ...response, commentCount: response.comments.length });
  const comments: PostComment[] = response.comments.map((comment) => ({
    id: String(comment.commentId),
    author: { nickname: comment.nickName, avatarUrl: comment.profileUrl ?? undefined },
    content: comment.content,
    createdAt: comment.createdAt,
    isOwner: comment.isOwner,
  }));
  return {
    post: { ...post, author: { ...post.author, introduction: response.introduction ?? undefined } },
    comments,
    isOwner: response.isOwner,
  };
}
