import type { PostSummary } from '../model/types';
import { PostMeta } from './PostMeta';
import { cn } from '@/shared/lib/utils';
import { Blank } from '@/shared/ui';

interface PostTitleSectionProps {
  post: Pick<PostSummary, 'title' | 'excerpt' | 'author' | 'createdAt' | 'commentCount'>;
  className?: string;
}

export function PostTitleSection({ post, className }: PostTitleSectionProps) {
  const { title, excerpt } = post;

  return (
    <div className={cn('flex w-full flex-col py-3', className)}>
      <div className="flex flex-col items-start justify-center gap-3 px-4 py-3">
        <h1 className="w-full text-24 font-medium text-black">{title}</h1>
        <p className="w-full text-14 font-light text-gray-20">{excerpt}</p>
      </div>
      <Blank size={32} />
      <PostMeta post={post} className="px-4 py-3" />
    </div>
  );
}
