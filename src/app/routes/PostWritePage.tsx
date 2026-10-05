import { useNavigate, useOutletContext } from 'react-router';

import type { PostDraft } from '@/features/posts/model/postDraft';
import { PostEditor } from '@/features/posts/ui/PostEditor';
import { Button } from '@/shared/ui/primitives/button';
import { notify } from '@/shared/ui/StatusToast';

import type { AppLayoutContext } from '../layouts/AppLayout';

export function PostWritePage() {
  const { previewUser, publishPost, trackImage, releaseImage, openLogin } =
    useOutletContext<AppLayoutContext>();
  const navigate = useNavigate();

  if (!previewUser)
    return (
      <main className="p-8 text-center font-auth">
        <h1>로그인이 필요합니다.</h1>
        <Button onClick={openLogin} className="mt-4">
          로그인하기
        </Button>
      </main>
    );

  function publish(draft: PostDraft) {
    const post = publishPost(draft);
    if (!post) {
      openLogin();
      return false;
    }
    navigate(`/posts/${post.id}`);
    notify.success('저장되었습니다!');
    return true;
  }

  return <PostEditor onPublish={publish} trackImage={trackImage} releaseImage={releaseImage} />;
}
