import { Link, useNavigate, useOutletContext, useParams } from 'react-router';

import { createPostDraft } from '@/features/posts/lib/postDraft';
import { isPostAuthor } from '@/features/posts/lib/postOwnership';
import type { PostDraft } from '@/features/posts/model/postDraft';
import { PostEditor } from '@/features/posts/ui/PostEditor';
import { Button } from '@/shared/ui/primitives/button';
import { notify } from '@/shared/ui/StatusToast';

import type { AppLayoutContext } from '../layouts/AppLayout';

export function PostWritePage() {
  const { previewUser, posts, publishPost, updatePost, trackImage, releaseImage, openLogin } =
    useOutletContext<AppLayoutContext>();
  const navigate = useNavigate();
  const { postId } = useParams();
  const existingPost = posts.find((post) => post.id === postId);

  if (!previewUser)
    return (
      <main className="p-8 text-center font-auth">
        <h1>로그인이 필요합니다.</h1>
        <Button onClick={openLogin} className="mt-4">
          로그인하기
        </Button>
      </main>
    );

  if (postId && !isPostAuthor(existingPost, previewUser))
    return (
      <main className="p-8 text-center font-auth">
        <h1>
          {existingPost ? '작성자만 게시글을 수정할 수 있습니다.' : '게시글을 찾을 수 없습니다.'}
        </h1>
        <Link to="/" className="mt-4 inline-block text-gitlog-action underline">
          목록으로
        </Link>
      </main>
    );

  function publish(draft: PostDraft) {
    const post = postId ? updatePost(postId, draft) : publishPost(draft);
    if (!post) {
      notify.error('게시글을 저장할 수 없습니다. 로그인과 작성자 권한을 확인해주세요.');
      return false;
    }
    navigate(`/posts/${post.id}`);
    notify.success('저장되었습니다!');
    return true;
  }

  return (
    <PostEditor
      key={postId ?? 'new'}
      initialDraft={existingPost ? createPostDraft(existingPost) : undefined}
      onPublish={publish}
      trackImage={trackImage}
      releaseImage={releaseImage}
    />
  );
}
