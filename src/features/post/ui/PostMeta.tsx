import { Link } from 'react-router';
import type { PostSummary } from '../model/types';
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
  // 넘기면 작성자 영역이 프로필 페이지 링크가 된다. 목록 아이템은 이미 게시글 링크 안에 있어 <a>가 중첩되므로 넘기지 않는다
  authorHref?: string;
  className?: string;
}

// 작성자 · 작성일 · 댓글 수 한 줄 — 목록 아이템과 상세 제목 영역이 함께 사용
export function PostMeta({ post, authorHref, className }: PostMetaProps) {
  const { author, createdAt, commentCount } = post;
  const authorContent = (
    <>
      <img
        src={author.profileImageUrl ?? defaultProfile}
        alt=""
        width={20}
        height={20}
        className="size-5 rounded-full object-cover"
      />
      <span className="text-gray-20">{author.nickname}</span>
    </>
  );

  return (
    <div className={cn('flex items-start text-12', className)}>
      {authorHref ? (
        <Link to={authorHref} className="flex h-5 items-center gap-1.5 hover:underline">
          {authorContent}
        </Link>
      ) : (
        <div className="flex h-5 items-center gap-1.5">{authorContent}</div>
      )}
      <MetaDivider />
      <time dateTime={createdAt} className="leading-5 font-light text-gray-56">
        {formatDate(createdAt)}
      </time>
      <MetaDivider />
      <span className="leading-5 font-light text-gray-56">댓글{commentCount}</span>
    </div>
  );
}
