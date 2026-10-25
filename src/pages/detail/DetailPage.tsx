import { DETAIL_AUTHOR_MOCK } from '@/features/detail/mocks/author.mock';
import { DETAIL_COMMENTS_MOCK, DETAIL_VIEWER_MOCK } from '@/features/detail/mocks/comments.mock';
import { DETAIL_POST_MOCK } from '@/features/detail/mocks/post.mock';
import { AuthorProfileSection } from '@/features/detail/sections/AuthorProfileSection';
import { BlogContentSection } from '@/features/detail/sections/BlogContentSection';
import { BlogTitleSection } from '@/features/detail/sections/BlogTitleSection';
import { CommentSection } from '@/features/detail/sections/CommentSection';

/** @returns 블로그 상세 페이지 UI */
export default function DetailPage() {
  return (
    <section className="flex h-fit w-full flex-col items-center justify-center">
      <BlogTitleSection
        title={DETAIL_POST_MOCK.title}
        nickname={DETAIL_POST_MOCK.nickname}
        createdAt={DETAIL_POST_MOCK.createdAt}
        commentCount={DETAIL_POST_MOCK.commentCount}
      />
      <BlogContentSection body={DETAIL_POST_MOCK.body} images={DETAIL_POST_MOCK.images} />
      <CommentSection
        comments={DETAIL_COMMENTS_MOCK}
        currentUserNickname={DETAIL_VIEWER_MOCK.nickname}
      />
      <AuthorProfileSection {...DETAIL_AUTHOR_MOCK} />
    </section>
  );
}
