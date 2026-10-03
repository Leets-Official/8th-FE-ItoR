import defaultProfile from '@/shared/assets/images/profile_20.svg';
import { formatDate } from '@/shared/lib/formatDate';
import { cn } from '@/shared/lib/utils';

interface CommentAuthorProps {
  nickname: string;
  profileImageUrl?: string;
  // 작성 중인 댓글 입력창 상단에서는 날짜 없이 쓴다
  createdAt?: string;
  className?: string;
}

export function CommentAuthor({
  nickname,
  profileImageUrl,
  createdAt,
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
        <span className="text-14 text-gray-20">{nickname}</span>
        {createdAt && (
          <time dateTime={createdAt} className="text-12 font-light text-gray-56">
            {formatDate(createdAt)}
          </time>
        )}
      </div>
    </div>
  );
}
