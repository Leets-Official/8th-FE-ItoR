/** 메인 페이지의 블로그 게시글 목록과 페이지네이션 영역입니다. */

import { Link } from '@tanstack/react-router';

import { Pagination } from '@/shared/ui/pagination/Pagination';
import { PostListItem } from '@/shared/ui/post/PostListItem';
import { Spacer } from '@/shared/ui/spacing/Spacer';
import { formatRelativeDate } from '@/shared/utils/date';

import { useMainPosts } from '../hooks/useMainPosts';

export function MainPostListSection() {
  const {
    posts,
    currentPage,
    totalPages,
    currentTime,
    isLoading,
    errorMessage,
    changePage,
    retry,
  } = useMainPosts();

  return (
    <section className="flex w-full flex-1 flex-col items-center">
      <Spacer variant="32" />

      {isLoading ? (
        <p role="status" className="text-14-light px-4 py-3 text-gray-56">
          게시물을 불러오고 있습니다.
        </p>
      ) : errorMessage ? (
        <div className="flex flex-col items-center gap-3 px-4 py-3">
          <p role="alert" className="text-14-light text-negative">
            {errorMessage}
          </p>
          <button type="button" onClick={retry} className="text-12-regular text-gray-20 underline">
            다시 시도
          </button>
        </div>
      ) : posts.length > 0 ? (
        <ul className="flex w-full max-w-[688px] flex-col">
          {posts.map((post, index) => (
            <li key={post.postId}>
              <Link to="/posts/$postId" params={{ postId: post.postId }} className="block">
                <PostListItem
                  title={post.title}
                  subtitle={post.subtitle}
                  nickname={post.nickName}
                  createdAt={formatRelativeDate(post.createdAt, currentTime)}
                  commentCount={post.commentCount}
                  profileImageUrl={post.profileUrl}
                  thumbnailImageUrl={post.thumbnailUrl}
                  imageLoading={index === 0 ? 'eager' : 'lazy'}
                />
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-14-light px-4 py-3 text-gray-56">등록된 게시물이 없습니다.</p>
      )}

      <div className="mt-auto flex w-full max-w-[688px] shrink-0 flex-col items-center">
        <Spacer variant="32" />

        {!isLoading && !errorMessage && posts.length > 0 ? (
          <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={changePage} />
        ) : null}

        <Spacer variant="64" />
      </div>
    </section>
  );
}
