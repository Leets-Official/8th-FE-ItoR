import type { PostSummary } from './types';
import defaultProfile from '@/shared/assets/images/profile_20.svg';
import { formatDate } from '@/shared/lib/formatDate';
import { cn } from '@/shared/lib/utils';

function MetaDivider() {
  return (
    <span aria-hidden className="flex h-5 w-3 items-center justify-center">
      <span className="size-0.5 rounded-full bg-gray-90" />
    </span>
  );
}

interface PostMetaProps {
  post: Pick<PostSummary, 'author' | 'createdAt' | 'commentCount'>;
  className?: string;
}

// 작성자 · 작성일 · 댓글 수 한 줄 — 목록 아이템과 상세 제목 영역이 함께 사용
export function PostMeta({ post, className }: PostMetaProps) {
  const { author, createdAt, commentCount } = post;

  return (
    <div className={cn('flex items-start text-12', className)}>
      <div className="flex h-5 items-center gap-1.5">
        <img
          src={author.profileImageUrl ?? defaultProfile}
          alt=""
          width={20}
          height={20}
          className="size-5 rounded-full object-cover"
        />
        <span className="text-gray-20">{author.nickname}</span>
      </div>
      <MetaDivider />
      <time dateTime={createdAt} className="leading-5 font-light text-gray-56">
        {formatDate(createdAt)}
      </time>
      <MetaDivider />
      <span className="leading-5 font-light text-gray-56">댓글{commentCount}</span>
    </div>
  );
}
