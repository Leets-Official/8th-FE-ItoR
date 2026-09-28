import { MessageSquareText } from 'lucide-react';
import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router';
import CommentSection from '@/components/comment/CommentSection';
import ConfirmModal from '@/components/common/ConfirmModal';
import DropdownMenu from '@/components/common/DropdownMenu';
import EmptyState from '@/components/common/EmptyState';
import IconButton from '@/components/common/IconButton';
import Header from '@/components/layout/Header';
import PageBanner from '@/components/layout/PageBanner';
import PostContentRenderer from '@/components/post/PostContentRenderer';
import PostMeta from '@/components/post/PostMeta';
import ProfileSummary from '@/components/profile/ProfileSummary';
import { ROUTES } from '@/constants/routes';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/useToast';
import { createMockComments } from '@/mocks/comments';
import { getMockPostDetail } from '@/mocks/posts';
import { MOCK_CURRENT_USER } from '@/mocks/users';

function PostDetailPage() {
  const { postId } = useParams();
  const { user } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const post = getMockPostDetail(Number(postId));

  if (!post) {
    return (
      <>
        <Header />
        <main className="mx-auto max-w-[680px] px-4 py-20">
          <EmptyState
            message="존재하지 않는 게시물입니다."
            action={
              <Link to={ROUTES.HOME} className="text-sm text-point underline underline-offset-2">
                목록으로 돌아가기
              </Link>
            }
          />
        </main>
      </>
    );
  }

  const isMyPost = user?.id === post.author.id;
  const authorProfile = post.author.id === MOCK_CURRENT_USER.id ? MOCK_CURRENT_USER : null;

  const deletePost = () => {
    setIsDeleteModalOpen(false);
    showToast('success', '게시물이 삭제되었습니다!');
    navigate(ROUTES.HOME);
  };

  return (
    <>
      <Header
        actions={
          <>
            <IconButton
              aria-label="댓글로 이동"
              onClick={() => document.getElementById('comments')?.scrollIntoView()}
            >
              <MessageSquareText size={18} aria-hidden />
            </IconButton>
            {isMyPost && (
              <DropdownMenu
                label="게시물 메뉴"
                items={[
                  { label: '수정하기', onSelect: () => navigate(ROUTES.POST_EDIT(post.id)) },
                  {
                    label: '삭제하기',
                    onSelect: () => setIsDeleteModalOpen(true),
                    isDanger: true,
                  },
                ]}
              />
            )}
          </>
        }
      />

      <main>
        <article>
          <header className="border-b border-gray-50">
            <div className="mx-auto max-w-[680px] px-4 pt-8 pb-6 md:pt-14">
              <h1 className="text-2xl font-medium text-ink md:text-[32px] md:leading-tight">
                {post.title}
              </h1>
              <div className="mt-6 md:mt-10">
                <PostMeta
                  author={post.author}
                  createdAt={post.createdAt}
                  commentCount={post.commentCount}
                />
              </div>
            </div>
          </header>

          <div className="mx-auto max-w-[680px] px-4 py-8 md:py-10">
            <PostContentRenderer contents={post.contents} />
          </div>
        </article>

        <div className="mx-auto max-w-[680px] px-4 pb-12">
          <CommentSection initialComments={createMockComments(post.commentCount)} />
        </div>

        <PageBanner>
          <ProfileSummary
            nickname={post.author.nickname}
            introduction={authorProfile?.introduction}
            profileImageUrl={post.author.profileImageUrl}
          />
        </PageBanner>
      </main>

      {isDeleteModalOpen && (
        <ConfirmModal
          title="게시물을 삭제하시겠습니까?"
          description="삭제된 게시물은 복구할 수 없습니다."
          confirmLabel="삭제하기"
          onCancel={() => setIsDeleteModalOpen(false)}
          onConfirm={deletePost}
        />
      )}
    </>
  );
}

export default PostDetailPage;
