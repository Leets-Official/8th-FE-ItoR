import { Link, useLocation, useOutletContext, useParams } from 'react-router';

import { CommentSection } from '@/features/comments/ui/CommentSection';
import { PostAuthor } from '@/features/posts/ui/PostAuthor';
import { PostContent } from '@/features/posts/ui/PostContent';
import { PostMetadata } from '@/features/posts/ui/PostMetadata';

import type { AppLayoutContext } from '../layouts/AppLayout';

export function PostDetailsPage() {
  const { postId } = useParams();
  const { search } = useLocation();
  const { openLogin, previewUser, posts, commentsByPost, setPostComments } =
    useOutletContext<AppLayoutContext>();
  const post = posts.find((item) => item.id === postId);

  if (!post)
    return (
      <main className="p-8 text-center">
        <h1>게시글을 찾을 수 없습니다.</h1>
        <Link
          to={{ pathname: '/', search }}
          className="mt-4 inline-block text-gitlog-action underline"
        >
          목록으로
        </Link>
      </main>
    );

  return (
    <main className="w-full font-auth">
      <article>
        <header className="border-b border-neutral-100 pt-9 sm:pt-16">
          <div className="mx-auto w-full max-w-[688px] py-3">
            <div className="space-y-3 px-4 py-3">
              <h1 className="text-2xl leading-10 font-medium break-words text-black">
                {post.title}
              </h1>
              {post.subtitle && (
                <p className="text-sm leading-6 font-light break-words text-zinc-800">
                  {post.subtitle}
                </p>
              )}
            </div>
            <PostMetadata
              post={{ ...post, commentCount: commentsByPost[post.id]?.length ?? post.commentCount }}
              className="mt-8 px-4 py-3"
            />
          </div>
        </header>
        <div className="border-b border-neutral-100">
          <PostContent blocks={post.content} />
        </div>
      </article>
      <CommentSection
        key={post.id}
        onLogin={openLogin}
        currentUser={previewUser}
        comments={commentsByPost[post.id] ?? []}
        onCommentsChange={(comments) => setPostComments(post.id, comments)}
      />
      <PostAuthor author={post.author} />
    </main>
  );
}
