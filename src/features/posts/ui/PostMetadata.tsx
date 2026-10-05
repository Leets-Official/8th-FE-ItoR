import { ProfileAvatar } from '@/shared/ui/ProfileAvatar';
import { cn } from '@/shared/utils/cn';

import { formatPublishedTime } from '@/shared/utils/formatPublishedTime';
import type { Post } from '../model/post';

interface PostMetadataProps {
  post: Post;
  now?: number;
  className?: string;
}

export function PostMetadata({ post, now, className }: PostMetadataProps) {
  return (
    <div
      className={cn(
        'flex min-w-0 items-center text-xs leading-5 font-light text-neutral-400',
        className,
      )}
    >
      <span className="flex min-w-0 items-center gap-1.5">
        <ProfileAvatar alt="" src={post.author.avatarUrl} size="sm" className="size-5" />
        <span className="max-w-24 truncate font-normal text-zinc-800 sm:max-w-40">
          {post.author.nickname}
        </span>
      </span>
      <span aria-hidden="true" className="flex w-3 shrink-0 justify-center">
        <span className="size-0.5 rounded-full bg-neutral-200" />
      </span>
      <time dateTime={post.publishedAt} className="shrink-0">
        {formatPublishedTime(post.publishedAt, now)}
      </time>
      <span aria-hidden="true" className="flex w-3 shrink-0 justify-center">
        <span className="size-0.5 rounded-full bg-neutral-200" />
      </span>
      <span className="shrink-0">댓글{post.commentCount}</span>
    </div>
  );
}
