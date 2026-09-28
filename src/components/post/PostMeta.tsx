import Avatar from '@/components/common/Avatar';
import type { Author } from '@/types/user';
import { formatDate } from '@/utils/formatDate';

interface PostMetaProps {
  author: Author;
  createdAt: string;
  commentCount: number;
}

/** 작성자 · 작성일 · 댓글 수 */
function PostMeta({ author, createdAt, commentCount }: PostMetaProps) {
  return (
    <div className="flex items-center gap-1.5 text-xs text-gray-500">
      <Avatar src={author.profileImageUrl} alt="" size="xs" />
      <span className="text-gray-700">{author.nickname}</span>
      <span aria-hidden>·</span>
      <time dateTime={createdAt}>{formatDate(createdAt)}</time>
      <span aria-hidden>·</span>
      <span>댓글{commentCount}</span>
    </div>
  );
}

export default PostMeta;
