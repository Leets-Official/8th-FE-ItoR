import { Settings } from 'lucide-react';
import { Link } from 'react-router';
import Header from '@/components/layout/Header';
import PageBanner from '@/components/layout/PageBanner';
import WritePostButton from '@/components/layout/WritePostButton';
import PaginatedPostList from '@/components/post/PaginatedPostList';
import ProfileSummary from '@/components/profile/ProfileSummary';
import { ROUTES } from '@/constants/routes';
import { useAuth } from '@/hooks/useAuth';
import { MOCK_POSTS } from '@/mocks/posts';

function MyBlogPage() {
  const { user } = useAuth();
  if (!user) return null;

  const myPosts = MOCK_POSTS.filter((post) => post.author.id === user.id);

  return (
    <>
      <Header actions={<WritePostButton />} />
      <main>
        <h1 className="sr-only">나의 깃로그</h1>
        <PageBanner>
          <ProfileSummary
            nickname={user.nickname}
            introduction={user.introduction}
            profileImageUrl={user.profileImageUrl}
            action={
              <Link
                to={ROUTES.PROFILE_SETTINGS}
                className="inline-flex items-center gap-1 rounded-xs border border-gray-100 bg-white px-2 py-1 text-xs text-gray-500 hover:bg-gray-50"
              >
                <Settings size={12} aria-hidden />내 프로필 설정
              </Link>
            }
          />
        </PageBanner>
        <div className="mx-auto max-w-[680px] pt-4">
          <PaginatedPostList
            posts={myPosts}
            emptyMessage="아직 작성한 깃로그가 없습니다. 첫 글을 써보세요!"
          />
        </div>
      </main>
    </>
  );
}

export default MyBlogPage;
