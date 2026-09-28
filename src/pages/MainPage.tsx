import Header from '@/components/layout/Header';
import WritePostButton from '@/components/layout/WritePostButton';
import PaginatedPostList from '@/components/post/PaginatedPostList';
import { MOCK_POSTS } from '@/mocks/posts';

function MainPage() {
  return (
    <>
      <Header actions={<WritePostButton />} />
      <main className="mx-auto max-w-[680px] pt-2 md:pt-8">
        <h1 className="sr-only">전체 깃로그</h1>
        <PaginatedPostList posts={MOCK_POSTS} />
      </main>
    </>
  );
}

export default MainPage;
