import { useState } from 'react';
import { Link, useParams } from 'react-router';
import { useAuth } from '@/features/auth';
import { MOCK_POSTS, PostListItem } from '@/features/post';
import { UserProfile } from '@/features/user';
import { Blank, Button, PageHeader, Pagination, useSidebar } from '@/shared/ui';

// 시안의 마이페이지는 한 페이지에 5개씩 보여 준다
const POSTS_PER_PAGE = 5;

// /users/:nickname — 사용자의 프로필과 작성한 글 목록. 내 페이지면 마이페이지로 쓴다
export function UserBlogPage() {
  const { nickname } = useParams();
  const { currentUser } = useAuth();
  const { openSidebar } = useSidebar();
  const [currentPage, setCurrentPage] = useState(1);

  const isMine = Boolean(currentUser) && currentUser?.nickname === nickname;
  // API 연동 전에는 작성자 id가 없어 닉네임으로 그 사용자의 글을 찾는다
  const userPosts = MOCK_POSTS.filter(({ author }) => author.nickname === nickname);
  // 내 정보는 로그인 정보에서, 다른 사용자 정보는 그 사람이 쓴 글의 작성자 정보에서 가져온다
  const user = isMine ? currentUser : userPosts[0]?.author;

  const pageCount = Math.ceil(userPosts.length / POSTS_PER_PAGE);
  const posts = userPosts.slice((currentPage - 1) * POSTS_PER_PAGE, currentPage * POSTS_PER_PAGE);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0 });
  };

  return (
    <div className="min-h-svh bg-white">
      <PageHeader variant="main" className="sticky top-0 z-10" onMenu={openSidebar} />
      {user ? (
        <main>
          {/* 배경이 gray96이라 흰 배경인 Blank 대신 py-16으로 위아래 64px 여백을 준다 */}
          <section className="flex w-full flex-col items-center border-b border-gray-96 bg-gray-96 py-16">
            <UserProfile user={user} className="max-w-[688px]">
              {isMine && (
                <Button variant="text" icon="settings" className="border border-gray-90" asChild>
                  <Link to="/profile">내 프로필 설정</Link>
                </Button>
              )}
            </UserProfile>
          </section>

          <section className="mx-auto flex w-full max-w-[688px] flex-col items-center">
            <Blank size={32} />
            {posts.length > 0 ? (
              <>
                <ul className="w-full">
                  {posts.map((post) => (
                    <li key={post.id}>
                      <Link to={`/posts/${post.id}`} className="block">
                        <PostListItem post={post} />
                      </Link>
                    </li>
                  ))}
                </ul>
                <Blank size={32} />
                <Pagination
                  pageCount={pageCount}
                  currentPage={currentPage}
                  onPageChange={handlePageChange}
                />
              </>
            ) : (
              <p className="py-16 text-14 text-gray-56">아직 작성한 깃로그가 없어요.</p>
            )}
            <Blank size={64} />
          </section>
        </main>
      ) : (
        <main className="flex flex-col items-center gap-4 py-16">
          <p className="text-14 text-gray-56">사용자를 찾을 수 없습니다.</p>
          <Button variant="outline" asChild>
            <Link to="/">목록으로</Link>
          </Button>
        </main>
      )}
    </div>
  );
}
