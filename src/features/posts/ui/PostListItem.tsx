import { Link, useLocation } from 'react-router';

import type { Post } from '../model/post';
import { PostMetadata } from './PostMetadata';

export function PostListItem({ post, now }: { post: Post; now: number }) {
  const { search } = useLocation();
  return (
    <li className="border-b border-neutral-100">
      <article>
        <Link
          to={{ pathname: `/posts/${post.id}`, search }}
          className="block py-2 focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-gitlog-action"
        >
          <div className="flex items-start gap-4">
            <div className="min-w-0 flex-1 px-4 py-3">
              <h2 className="truncate text-base leading-6 font-medium text-black">{post.title}</h2>
              <p className="mt-2 line-clamp-2 h-12 text-sm leading-6 font-light text-neutral-600">
                {post.summary}
              </p>
            </div>
            {post.thumbnailUrl && (
              <div className="flex h-26 w-32 shrink-0 justify-end px-4 pt-3">
                <img
                  src={post.thumbnailUrl}
                  alt=""
                  width={92}
                  height={92}
                  loading="lazy"
                  className="size-23 shrink-0 rounded-xs object-cover"
                />
              </div>
            )}
          </div>
          <PostMetadata post={post} now={now} className="px-4 py-3" />
        </Link>
      </article>
    </li>
  );
}
