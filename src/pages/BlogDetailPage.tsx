import { useRef, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link, useNavigate, useParams } from 'react-router';
import { deleteMockPost, getMockPostDetail, PostContent, PostTitleSection } from '@/features/post';
import { Blank, Button, Modal, PageHeader, showToast, useSidebar } from '@/shared/ui';
import { useAuth, useLoginModal } from '@/features/auth';
import { CommentSection, commentQueryKeys, getComments } from '@/features/comment';
import { getUserPath, UserProfile } from '@/features/user';
import { cn } from '@/shared/lib/utils';

const SECTION_CLASS = 'flex w-full flex-col items-center border-b border-gray-96';
const CONTENT_CLASS = 'flex w-full max-w-[688px] flex-col';

export function BlogDetailPage() {
  const { postId } = useParams();
  const commentSectionRef = useRef<HTMLElement>(null);
  const post = getMockPostDetail(Number(postId));
  const { currentUser } = useAuth();
  const { openLoginModal } = useLoginModal();
  const { openSidebar } = useSidebar();
  const navigate = useNavigate();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const { data: comments = [] } = useQuery({
    queryKey: commentQueryKeys.list(Number(postId)),
    queryFn: () => getComments(Number(postId)),
    enabled: Boolean(post),
  });

  function handleEdit() {
    navigate(`/posts/${postId}/edit`);
  }

  function handleDeleteConfirm() {
    deleteMockPost(Number(postId));
    showToast('positive', '삭제가 완료되었습니다!');
    // 뒤로 가기로 지운 글에 돌아오지 않게 바꿔 끼운다
    navigate('/', { replace: true });
  }

  function handleChat() {
    commentSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  if (!post) {
    return (
      <div className="min-h-svh bg-white">
        <PageHeader variant="detail" className="sticky top-0 z-10" onMenu={openSidebar} />
        <main className="flex flex-col items-center gap-4 py-16">
          <p className="text-14 text-gray-56">게시글을 찾을 수 없습니다.</p>
          <Button variant="outline" asChild>
            <Link to="/">목록으로</Link>
          </Button>
        </main>
      </div>
    );
  }

  const { content, author } = post;
  // API 연동 전에는 작성자 id가 없어 닉네임으로 내 글인지 판단한다
  const isMine = currentUser?.nickname === author.nickname;

  return (
    <div className="min-h-svh bg-white">
      <PageHeader
        variant="detail"
        className="sticky top-0 z-10"
        onMenu={openSidebar}
        onChat={handleChat}
        // 내 글이 아니면 수정·삭제할 수 없어 더보기 버튼을 숨긴다
        onEdit={isMine ? handleEdit : undefined}
        onDelete={isMine ? () => setIsDeleteModalOpen(true) : undefined}
      />
      <main>
        <section className={cn(SECTION_CLASS, 'bg-white')}>
          <Blank size={64} />
          <PostTitleSection
            post={post}
            authorHref={getUserPath(author.nickname)}
            className="max-w-[688px]"
          />
        </section>

        <section className={cn(SECTION_CLASS, 'bg-white')}>
          <Blank size={32} />
          <div className={CONTENT_CLASS}>
            <PostContent content={content} />
          </div>
          <Blank size={32} />
        </section>

        <section ref={commentSectionRef} className={cn(SECTION_CLASS, 'scroll-mt-[72px] bg-white')}>
          <div className={CONTENT_CLASS}>
            <CommentSection
              postId={post.id}
              comments={comments}
              currentUser={currentUser}
              onLoginRequest={openLoginModal}
            />
          </div>
          <Blank size={64} />
        </section>

        {/* 배경이 gray96이라 흰 배경인 Blank 대신 py-16으로 위아래 64px 여백을 준다 */}
        <section className={cn(SECTION_CLASS, 'bg-gray-96 py-16')}>
          <UserProfile user={author} className="max-w-[688px]" />
        </section>
      </main>
      <Modal
        variant="destructive"
        open={isDeleteModalOpen}
        onOpenChange={setIsDeleteModalOpen}
        title="해당 블로그를 삭제하시겠어요?"
        description="삭제된 블로그는 다시 확인할 수 없어요."
        confirmLabel="삭제하기"
        onConfirm={handleDeleteConfirm}
      />
    </div>
  );
}
