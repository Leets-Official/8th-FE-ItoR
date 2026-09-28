import { Link } from 'react-router';
import { ROUTES } from '@/constants/routes';
import type { PostSummary } from '@/types/post';
import PostMeta from './PostMeta';

interface PostCardProps {
  post: PostSummary;
}

function PostCard({ post }: PostCardProps) {
  const { id, title, preview, thumbnailUrl, author, createdAt, commentCount } = post;

  return (
    <li className="border-b border-gray-50">
      <Link
        to={ROUTES.POST_DETAIL(id)}
        className="group flex gap-4 px-4 py-5 transition-colors hover:bg-gray-50/60 focus-visible:bg-gray-50 focus-visible:outline-none md:gap-10"
      >
        <article className="flex min-w-0 flex-1 flex-col gap-2">
          <h3 className="truncate text-base font-medium text-ink group-hover:underline">{title}</h3>
          <p className="line-clamp-2 min-h-10 text-sm leading-5 font-light text-gray-700">
            {preview}
          </p>
          <div className="mt-2">
            <PostMeta author={author} createdAt={createdAt} commentCount={commentCount} />
          </div>
        </article>
        {thumbnailUrl && (
          <img
            src={thumbnailUrl}
            alt=""
            loading="lazy"
            decoding="async"
            width={92}
            height={92}
            className="size-16 shrink-0 rounded-xs object-cover md:size-[92px]"
          />
        )}
      </Link>
    </li>
  );
}

export default PostCard;
