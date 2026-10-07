import type { PostSummary } from './types';
import { PostMeta } from './PostMeta';
import { cn } from '@/shared/lib/utils';
import { Blank } from '@/shared/ui';

interface PostTitleSectionProps {
  post: Pick<PostSummary, 'title' | 'author' | 'createdAt' | 'commentCount'>;
  className?: string;
}

export function PostTitleSection({ post, className }: PostTitleSectionProps) {
  const { title } = post;

  return (
    <div className={cn('flex w-full flex-col py-3', className)}>
      <div className="flex flex-col items-start justify-center gap-3 px-4 py-3">
        <h1 className="w-full text-24 font-medium text-black">{title}</h1>
      </div>
      <Blank size={32} />
      <PostMeta post={post} className="px-4 py-3" />
    </div>
  );
}
