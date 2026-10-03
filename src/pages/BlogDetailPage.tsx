import { useRef, useState } from 'react';
import { Link, useParams } from 'react-router';
import { getMockPostDetail, PostContent, PostTitleSection } from '@/features/post';
import defaultProfile from '@/shared/assets/images/profile_64.svg';
import { Blank, Button, PageHeader, showToast } from '@/shared/ui';
import { useAuth } from '@/features/auth';
import { CommentSection, type PostComment } from '@/features/comment';

const SECTION_CLASS = 'flex w-full flex-col items-center border-b border-gray-96';
const CONTENT_CLASS = 'flex w-full max-w-[688px] flex-col';

export function BlogDetailPage() {
  const { postId } = useParams();
  const commentSectionRef = useRef<HTMLElement>(null);
  const post = getMockPostDetail(Number(postId));
  const { currentUser } = useAuth();
  // 댓글 API 연동 전이라 작성한 댓글은 이 페이지 상태에만 보관한다
  const [comments, setComments] = useState<PostComment[]>([]);

  function handleCommentSubmit(content: string) {
    if (!currentUser) return;

    setComments((prevComments) => [
      ...prevComments,
      {
        id: Date.now(),
        author: { nickname: currentUser.nickname, profileImageUrl: currentUser.profileImageUrl },
        content,
        createdAt: new Date().toISOString(),
      },
    ]);
  }

  function handleCommentDelete(commentId: number) {
    setComments((prevComments) => prevComments.filter((comment) => comment.id !== commentId));
    showToast('positive', '삭제가 완료되었습니다!');
  }

  function handleChat() {
    commentSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  if (!post) {
    return (
      <div className="min-h-svh bg-white">
        <PageHeader variant="detail" className="sticky top-0 z-10" />
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
      <PageHeader variant="detail" onChat={handleChat} className="sticky top-0 z-10" />
      <main>
        <section className={`${SECTION_CLASS} bg-white`}>
          <Blank size={64} />
          <PostTitleSection post={post} className="max-w-[688px]" />
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
              comments={comments}
              currentUser={currentUser}
              onCommentSubmit={handleCommentSubmit}
              onCommentDelete={handleCommentDelete}
            />
          </div>
          <Blank size={64} />
        </section>

        {/* 배경이 gray96이라 흰 배경인 Blank 대신 py-16으로 위아래 64px 여백을 준다 */}
        <section className={`${SECTION_CLASS} bg-gray-96 py-16`}>
          <div className={CONTENT_CLASS}>
            <div className="px-4 py-3">
              <img
                src={author.profileImageUrl ?? defaultProfile}
                alt=""
                width={64}
                height={64}
                className="size-16 rounded-full object-cover"
              />
            </div>
            <div className="flex flex-col gap-3 px-4 py-3">
              <p className="text-24 font-medium text-black">{author.nickname}</p>
              {author.introduction && (
                <p className="text-14 font-light text-gray-20">{author.introduction}</p>
              )}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
