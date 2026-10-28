import { Link } from 'react-router';
import defaultProfile from '@/shared/assets/images/profile_20.svg';
import { formatDate } from '@/shared/lib/formatDate';
import { cn } from '@/shared/lib/utils';

interface CommentAuthorProps {
  nickname: string;
  profileImageUrl?: string;
  // 작성 중인 댓글 입력창 상단에서는 날짜 없이 쓴다
  createdAt?: string;
  // 넘기면 닉네임이 프로필 페이지 링크가 된다. 입력창 상단의 내 정보에는 넘기지 않는다
  authorHref?: string;
  className?: string;
}

export function CommentAuthor({
  nickname,
  profileImageUrl,
  createdAt,
  authorHref,
  className,
}: CommentAuthorProps) {
  return (
    <div className={cn('flex items-start gap-1.5', className)}>
      <img
        src={profileImageUrl ?? defaultProfile}
        alt=""
        width={20}
        height={20}
        className="size-5 shrink-0 rounded-full object-cover"
      />
      <div className="flex flex-col">
        {authorHref ? (
          <Link to={authorHref} className="text-14 text-gray-20 hover:underline">
            {nickname}
          </Link>
        ) : (
          <span className="text-14 text-gray-20">{nickname}</span>
        )}
        {createdAt && (
          <time dateTime={createdAt} className="text-12 font-light text-gray-56">
            {formatDate(createdAt)}
          </time>
        )}
      </div>
    </div>
  );
}
