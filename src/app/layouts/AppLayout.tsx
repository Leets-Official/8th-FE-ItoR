import { Outlet } from 'react-router';

import type { PostComment } from '@/features/comments/model/comment';
import { usePreviewComments } from '@/features/comments/model/usePreviewComments';
import type { Post } from '@/features/posts/model/post';
import type { PostDraft } from '@/features/posts/model/postDraft';
import { usePostImageUrls } from '@/features/posts/model/usePostImageUrls';
import { usePreviewPosts } from '@/features/posts/model/usePreviewPosts';
import type { User } from '@/shared/types/user';
import { Toaster } from '@/shared/ui/primitives/sonner';

import { AppHeader } from './header/AppHeader';
import { useLayoutAuth } from './hooks/useLayoutAuth';
import { useRouteScroll } from './hooks/useRouteScroll';

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
  const {
    loginOpen,
    previewUser,
    setPreviewSignedIn,
    openLogin,
    changeLoginOpen,
    completeLogin,
    startWriting,
  } = useLayoutAuth();
  const { posts, publishPost } = usePreviewPosts(previewUser);
  const { trackImage, releaseImage } = usePostImageUrls();
  const { commentsByPost, setPostComments } = usePreviewComments();
  useRouteScroll();

  return (
    <div className="min-h-dvh bg-white text-neutral-950">
      <AppHeader
        signedIn={previewUser !== null}
        loginOpen={loginOpen}
        onLoginOpenChange={changeLoginOpen}
        onLogin={completeLogin}
        onOpenLogin={openLogin}
        onWrite={startWriting}
      />
      <Outlet
        context={
          {
            openLogin,
            previewUser,
            setPreviewSignedIn,
            posts,
            publishPost,
            startWriting,
            trackImage,
            releaseImage,
            commentsByPost,
            setPostComments,
          } satisfies AppLayoutContext
        }
      />
      <Toaster offset={88} mobileOffset={88} />
    </div>
  );
}
