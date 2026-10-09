import { useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link, useParams } from 'react-router';
import { getMockPostDetail, PostContent, PostTitleSection } from '@/features/post';
import { Blank, Button, PageHeader, useSidebar } from '@/shared/ui';
import { useAuth, useLoginModal } from '@/features/auth';
import { CommentSection, commentQueryKeys, getComments } from '@/features/comment';
import { getUserPath, UserProfile } from '@/features/user';

const SECTION_CLASS = 'flex w-full flex-col items-center border-b border-gray-96';
const CONTENT_CLASS = 'flex w-full max-w-[688px] flex-col';

export function BlogDetailPage() {
  const { postId } = useParams();
  const commentSectionRef = useRef<HTMLElement>(null);
  const post = getMockPostDetail(Number(postId));
  const { currentUser } = useAuth();
  const { openLoginModal } = useLoginModal();
  const { openSidebar } = useSidebar();
  const { data: comments = [] } = useQuery({
    queryKey: commentQueryKeys.list(Number(postId)),
    queryFn: () => getComments(Number(postId)),
    enabled: Boolean(post),
  });

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

  return (
    <div className="min-h-svh bg-white">
      <PageHeader
        variant="detail"
        className="sticky top-0 z-10"
        onMenu={openSidebar}
        onChat={handleChat}
      />
      <main>
        <section className={`${SECTION_CLASS} bg-white`}>
          <Blank size={64} />
          <PostTitleSection
            post={post}
            authorHref={getUserPath(author.nickname)}
            className="max-w-[688px]"
          />
        </section>

        <section className={`${SECTION_CLASS} bg-white`}>
          <Blank size={32} />
          <div className={CONTENT_CLASS}>
            <PostContent content={content} />
          </div>
          <Blank size={32} />
        </section>

        <section ref={commentSectionRef} className={`${SECTION_CLASS} scroll-mt-[72px] bg-white`}>
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
        <section className={`${SECTION_CLASS} bg-gray-96 py-16`}>
          <UserProfile user={author} className="max-w-[688px]" />
        </section>
      </main>
    </div>
  );
}
