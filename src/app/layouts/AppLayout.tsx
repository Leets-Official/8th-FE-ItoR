import { useCallback, useEffect, useRef, useState } from 'react';

import { Outlet, useLocation, useNavigate } from 'react-router';

import { LoginDialog } from '@/features/auth/ui/LoginDialog';
import type { PostComment } from '@/features/comments/model/comment';
import { previewComments } from '@/features/comments/model/previewComments';
import { buildPostContent, getPostDraftError } from '@/features/posts/lib/postDraft';
import type { Post } from '@/features/posts/model/post';
import type { PostDraft } from '@/features/posts/model/postDraft';
import { previewPosts } from '@/features/posts/model/previewPosts';
import { PREVIEW_USER } from '@/shared/mocks/previewUser';
import type { User } from '@/shared/types/user';
import { ChatIcon, CreateIcon, MoreVertIcon, ReorderIcon } from '@/shared/assets/icons';
import { ActionMenu } from '@/shared/ui/ActionMenu';
import { IconButton } from '@/shared/ui/IconButton';
import { GitlogButton } from '@/shared/ui/GitlogButton';
import { PageHeader } from '@/shared/ui/PageHeader';
import { Button } from '@/shared/ui/primitives/button';
import { Toaster } from '@/shared/ui/primitives/sonner';

export interface AppLayoutContext {
  openLogin: () => void;
  previewUser: User | null;
  setPreviewSignedIn: (signedIn: boolean) => void;
  posts: Post[];
  publishPost: (draft: PostDraft) => Post | null;
  startWriting: () => void;
  trackImage: (url: string) => void;
  releaseImage: (url: string) => void;
  commentsByPost: Record<string, PostComment[]>;
  setPostComments: (postId: string, comments: PostComment[]) => void;
}

export function AppLayout() {
  const navigate = useNavigate();
  const { pathname, search, hash } = useLocation();
  const [loginOpen, setLoginOpen] = useState(false);
  const [writeAfterLogin, setWriteAfterLogin] = useState(false);
  const [previewSignedIn, setPreviewSignedIn] = useState(false);
  const [posts, setPosts] = useState(previewPosts);
  const imageUrls = useRef(new Set<string>());
  const [commentsByPost, setCommentsByPost] = useState<Record<string, PostComment[]>>({
    '2': previewComments,
    preview: previewComments,
  });
  const isWritingPage = pathname === '/posts/new';
  const isPostPage = pathname.startsWith('/posts/') && !isWritingPage;
  const isBlogPage = pathname === '/' || isPostPage || isWritingPage;
  const trackImage = useCallback((url: string) => {
    imageUrls.current.add(url);
  }, []);
  const releaseImage = useCallback((url: string) => {
    imageUrls.current.delete(url);
    URL.revokeObjectURL(url);
  }, []);

  useEffect(() => {
    const urls = imageUrls.current;
    return () => {
      urls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, []);

  function startWriting() {
    if (previewSignedIn) navigate('/posts/new');
    else {
      setWriteAfterLogin(true);
      setLoginOpen(true);
    }
  }

  function publishPost(draft: PostDraft): Post | null {
    if (!previewSignedIn || getPostDraftError(draft)) return null;
    const content = buildPostContent(draft.blocks);
    const post: Post = {
      id: crypto.randomUUID(),
      title: draft.title.trim(),
      summary: content
        .filter((block) => block.type === 'text')
        .map((block) => block.text)
        .join(' '),
      content,
      author: PREVIEW_USER,
      publishedAt: new Date().toISOString(),
      commentCount: 0,
      thumbnailUrl: content.find((block) => block.type === 'image')?.src,
    };
    setPosts((previous) => [post, ...previous]);
    return post;
  }

  useEffect(() => {
    if (hash === '#post-comments') document.getElementById('post-comments')?.scrollIntoView();
    else window.scrollTo(0, 0);
  }, [pathname, hash]);

  return (
    <div className="min-h-dvh bg-white text-neutral-950">
      <PageHeader
        className={
          isBlogPage
            ? `h-18 bg-white/90 py-4 font-auth backdrop-blur-[2px] ${isWritingPage ? 'border-b border-neutral-100' : ''}`
            : undefined
        }
        menu={
          <ActionMenu
            label="메뉴 열기"
            trigger={
              <IconButton label="메뉴 열기">
                <ReorderIcon aria-hidden="true" />
              </IconButton>
            }
            items={[
              { id: 'home', label: '홈', onSelect: () => navigate('/') },
              { id: 'write', label: '깃로그 쓰기', onSelect: startWriting },
              { id: 'signup', label: '회원가입', onSelect: () => navigate('/mypage/signup') },
            ]}
          />
        }
        actions={
          <>
            {isWritingPage && previewSignedIn && (
              <>
                <Button
                  type="reset"
                  form="post-editor"
                  variant="ghost"
                  className="h-10 px-2 text-sm font-normal text-gitlog-danger sm:px-3"
                >
                  삭제하기
                </Button>
                <Button
                  type="submit"
                  form="post-editor"
                  variant="ghost"
                  className="h-10 px-2 text-sm font-normal text-black sm:px-3"
                >
                  게시하기
                </Button>
              </>
            )}
            {pathname === '/' && (
              <GitlogButton
                appearance="text"
                onClick={startWriting}
                icon={<CreateIcon aria-hidden="true" className="opacity-50" />}
                className="h-10 rounded-full text-sm text-neutral-400"
              >
                깃로그 쓰기
              </GitlogButton>
            )}
            {isPostPage && (
              <>
                <Button asChild variant="ghost" size="icon-lg" aria-label="댓글로 이동">
                  <a href="#post-comments">
                    <ChatIcon aria-hidden="true" className="size-6" />
                  </a>
                </Button>
                <ActionMenu
                  label="게시글 메뉴 열기"
                  trigger={
                    <IconButton label="게시글 메뉴 열기" size="lg">
                      <MoreVertIcon aria-hidden="true" className="size-6" />
                    </IconButton>
                  }
                  items={[
                    {
                      id: 'list',
                      label: '목록으로',
                      onSelect: () => navigate({ pathname: '/', search }),
                    },
                    { id: 'login', label: '로그인', onSelect: () => setLoginOpen(true) },
                  ]}
                />
              </>
            )}
            <LoginDialog
              open={loginOpen}
              onOpenChange={(open) => {
                setLoginOpen(open);
                if (!open) setWriteAfterLogin(false);
              }}
              onLogin={() => {
                setPreviewSignedIn(true);
                setLoginOpen(false);
                setWriteAfterLogin(false);
                if (writeAfterLogin) navigate('/posts/new');
              }}
              trigger={isBlogPage ? null : undefined}
            />
          </>
        }
      />
      <Outlet
        context={
          {
            openLogin: () => setLoginOpen(true),
            previewUser: previewSignedIn ? PREVIEW_USER : null,
            setPreviewSignedIn,
            posts,
            publishPost,
            startWriting,
            trackImage,
            releaseImage,
            commentsByPost,
            setPostComments: (postId, comments) =>
              setCommentsByPost((previous) => ({ ...previous, [postId]: comments })),
          } satisfies AppLayoutContext
        }
      />
      <Toaster offset={88} mobileOffset={88} />
    </div>
  );
}
