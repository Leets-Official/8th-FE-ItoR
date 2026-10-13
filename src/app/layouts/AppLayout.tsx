import { useEffect, useRef, useState } from 'react';

import { Outlet, useMatch, useNavigate } from 'react-router';

import { isPostAuthor } from '@/features/posts/lib/postOwnership';
import type { PostComment } from '@/features/comments/model/comment';
import { usePreviewComments } from '@/features/comments/model/usePreviewComments';
import type { Post } from '@/features/posts/model/post';
import type { PostDraft } from '@/features/posts/model/postDraft';
import { usePostImageUrls } from '@/features/posts/model/usePostImageUrls';
import { usePreviewPosts } from '@/features/posts/model/usePreviewPosts';
import type { Profile, ProfileDraft } from '@/features/profile/model/profile';
import { Toaster } from '@/shared/ui/primitives/sonner';
import { notify } from '@/shared/ui/StatusToast';
import { cn } from '@/shared/utils/cn';
import { GitlogButton } from '@/shared/ui/GitlogButton';

import { AppHeader } from './header/AppHeader';
import { AppSidebar } from './AppSidebar';
import { useLayoutAuth } from './hooks/useLayoutAuth';
import { useRouteScroll } from './hooks/useRouteScroll';

export interface AppLayoutContext {
  openLogin: () => void;
  previewUser: Profile | null;
  updateProfile: (draft: ProfileDraft) => boolean;
  posts: Post[];
  publishPost: (draft: PostDraft) => Post | null;
  updatePost: (id: string, draft: PostDraft) => Post | null;
  startWriting: () => void;
  trackImage: (url: string) => void;
  releaseImage: (url: string) => void;
  commentsByPost: Record<string, PostComment[]>;
  setPostComments: (postId: string, comments: PostComment[]) => void;
}

export function AppLayout() {
  const {
    loginOpen,
    previewUser,
    updateProfile,
    isRestoring,
    authError,
    retryAuth,
    openLogin,
    changeLoginOpen,
    completeLogin,
    startWriting,
    logout,
  } = useLayoutAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const menuButton = useRef<HTMLButtonElement>(null);
  const restoreMenuFocus = useRef(false);

  useEffect(() => {
    if (!sidebarOpen && restoreMenuFocus.current) {
      menuButton.current?.focus({ preventScroll: true });
      restoreMenuFocus.current = false;
    }
  }, [sidebarOpen]);

  function closeSidebar() {
    restoreMenuFocus.current = true;
    setSidebarOpen(false);
  }
  const users = previewUser ? [previewUser] : [];
  const { posts, publishPost, updatePost, deletePost } = usePreviewPosts(previewUser, users);
  const { trackImage, releaseImage } = usePostImageUrls();
  const { commentsByPost, setPostComments } = usePreviewComments(users);
  const detailMatch = useMatch('/posts/:postId');
  const currentPost = posts.find((post) => post.id === detailMatch?.params.postId);
  const navigate = useNavigate();
  useRouteScroll();

  function savePost(id: string, draft: PostDraft) {
    const previousPost = posts.find((post) => post.id === id);
    const updated = updatePost(id, draft);
    if (updated) {
      previousPost?.content.forEach((block) => {
        if (
          block.type === 'image' &&
          !updated.content.some((item) => item.type === 'image' && item.src === block.src)
        )
          releaseImage(block.src);
      });
    }
    return updated;
  }

  function removeCurrentPost() {
    if (!currentPost || !deletePost(currentPost.id)) {
      notify.error('작성자만 게시글을 삭제할 수 있습니다.');
      return;
    }
    currentPost.content.forEach((block) => {
      if (block.type === 'image') releaseImage(block.src);
    });
    setPostComments(currentPost.id, []);
    navigate('/');
    notify.success('삭제가 완료되었습니다!');
  }

  return (
    <div className={cn('min-h-dvh bg-white text-neutral-950', sidebarOpen && 'sm:pl-60 xl:pl-0')}>
      {sidebarOpen && (
        <AppSidebar
          user={previewUser}
          onClose={closeSidebar}
          onStart={() => {
            menuButton.current?.focus({ preventScroll: true });
            setSidebarOpen(false);
            openLogin();
          }}
          onMyGitlog={() => {
            setSidebarOpen(false);
            navigate('/?view=mine');
          }}
          onWrite={() => {
            setSidebarOpen(false);
            startWriting();
          }}
          onSettings={() => {
            setSidebarOpen(false);
            navigate('/mypage/settings');
          }}
          onLogout={logout}
        />
      )}
      <AppHeader
        sidebarOpen={sidebarOpen}
        onToggleSidebar={() => (sidebarOpen ? closeSidebar() : setSidebarOpen(true))}
        menuButtonRef={menuButton}
        signedIn={previewUser !== null}
        loginOpen={loginOpen}
        onLoginOpenChange={changeLoginOpen}
        onLogin={completeLogin}
        onWrite={() => {
          setSidebarOpen(false);
          startWriting();
        }}
        canManagePost={isPostAuthor(currentPost, previewUser)}
        onEditPost={() => {
          if (currentPost && isPostAuthor(currentPost, previewUser))
            navigate(`/posts/${currentPost.id}/edit`);
        }}
        onDeletePost={removeCurrentPost}
      />
      {isRestoring ? (
        <p role="status" className="p-8 text-center">
          로그인 정보를 불러오고 있습니다.
        </p>
      ) : authError ? (
        <main className="p-8 text-center">
          <p role="alert">{authError}</p>
          <GitlogButton onClick={retryAuth} className="mt-4">
            다시 시도
          </GitlogButton>
          <GitlogButton onClick={logout} className="mt-4">
            로그아웃
          </GitlogButton>
        </main>
      ) : (
        <Outlet
          context={
            {
              openLogin,
              previewUser,
              updateProfile,
              posts,
              publishPost,
              updatePost: savePost,
              startWriting,
              trackImage,
              releaseImage,
              commentsByPost,
              setPostComments,
            } satisfies AppLayoutContext
          }
        />
      )}
      <Toaster offset={88} mobileOffset={88} />
    </div>
  );
}
