import { ProfileAvatar } from '@/shared/ui/ProfileAvatar';

import type { Post } from '../model/post';

export function PostAuthor({ author }: { author: Post['author'] }) {
  return (
    <section
      aria-label="작성자 소개"
      className="min-h-96 border-b border-neutral-100 bg-neutral-100 py-9 sm:py-16"
    >
      <div className="mx-auto w-full max-w-[688px]">
        <div className="px-4 py-3">
          <ProfileAvatar alt="" src={author.avatarUrl} size="lg" className="size-16" />
        </div>
        <div className="space-y-3 px-4 py-3">
          <h2 className="text-2xl leading-10 font-medium break-words text-black">
            {author.nickname}
          </h2>
          {author.introduction && (
            <p className="text-sm leading-6 font-light break-words text-zinc-800">
              {author.introduction}
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
