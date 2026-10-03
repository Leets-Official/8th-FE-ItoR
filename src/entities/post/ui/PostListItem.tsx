import type { PostSummary } from '../model/types';
import { PostMeta } from './PostMeta';

interface PostListItemProps {
  post: PostSummary;
}

export function PostListItem({ post }: PostListItemProps) {
  const { title, excerpt, thumbnailUrl } = post;

  return (
    <article className="flex w-full gap-4 border-b border-gray-96 bg-white py-2">
      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex flex-col justify-center gap-2 px-4 py-3">
          <h2 className="truncate text-16 font-medium text-black">{title}</h2>
          <p className="line-clamp-2 h-12 text-14 font-light text-gray-33">{excerpt}</p>
        </div>
        <PostMeta post={post} className="h-11 px-4 py-3" />
      </div>
      {thumbnailUrl && (
        <div className="flex shrink-0 items-center px-4 py-3">
          <img
            src={thumbnailUrl}
            alt=""
            width={92}
            height={92}
            loading="lazy"
            className="size-[92px] rounded-[2px] object-cover"
          />
        </div>
      )}
    </article>
  );
}
