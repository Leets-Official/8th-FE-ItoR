import { useRef, useState } from 'react';
import { Navigate, useNavigate, useParams } from 'react-router';
import { useAuth } from '@/features/auth';
import {
  createMockPost,
  deleteMockPost,
  getMockPostDetail,
  PostEditor,
  updateMockPost,
  type PostCreateInput,
} from '@/features/post';
import { Modal, PageHeader, showToast, useSidebar, useToastOffset } from '@/shared/ui';

// 시안: 헤더(72px)와 사진 추가하기 줄(49px) 아래에 토스트가 뜬다
const TOAST_OFFSET_TOP = 138;

// /write — 새 글 쓰기, /posts/:postId/edit — 내 글 수정하기
export function PostWritePage() {
  const { postId } = useParams();
  const { currentUser } = useAuth();
  const { openSidebar } = useSidebar();
  const navigate = useNavigate();
  const editorRef = useRef<HTMLFormElement>(null);
  const [isDirty, setIsDirty] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  useToastOffset(TOAST_OFFSET_TOP);

  const isEditing = postId !== undefined;
  const post = isEditing ? getMockPostDetail(Number(postId)) : undefined;

  // 글쓰기는 로그인한 사용자만 할 수 있다. 쓰는 중에 로그아웃해도 메인으로 보낸다
  if (!currentUser) return <Navigate to="/" replace />;
  // 없는 글이거나 남의 글이면 수정할 수 없다
  if (isEditing && !post) return <Navigate to="/" replace />;
  if (post && post.author.nickname !== currentUser.nickname) {
    return <Navigate to={`/posts/${post.id}`} replace />;
  }

  // 새 글은 쓰던 내용을 버리고 메인으로, 수정 중인 글은 게시글 자체를 지운다
  function handleDeleteConfirm() {
    if (post) {
      deleteMockPost(post.id);
      showToast('positive', '삭제되었습니다.');
    }
    navigate('/', { replace: true });
  }

  // 새 글에 아무것도 쓰지 않았으면 지울 것이 없으므로 묻지 않고 나간다
  function handleDelete() {
    if (post || isDirty) setIsDeleteModalOpen(true);
    else navigate('/', { replace: true });
  }

  function handleSubmit(input: PostCreateInput) {
    if (!currentUser) return;

    let savedPostId: number;
    if (post) {
      updateMockPost(post.id, input);
      savedPostId = post.id;
      showToast('positive', '수정되었습니다!');
    } else {
      const { nickname, profileImageUrl, introduction } = currentUser;
      savedPostId = createMockPost(input, { nickname, profileImageUrl, introduction });
      showToast('positive', '게시되었습니다!');
    }
    // 뒤로 가기로 다 쓴 글쓰기 화면에 돌아오지 않게 바꿔 끼운다
    navigate(`/posts/${savedPostId}`, { replace: true });
  }

  return (
    <div className="min-h-svh bg-white">
      <PageHeader
        variant="write"
        className="sticky top-0 z-20"
        onMenu={openSidebar}
        onDelete={handleDelete}
        // 검증과 게시는 에디터 폼의 submit에서 처리한다
        onPublish={() => editorRef.current?.requestSubmit()}
      />
      <main>
        <PostEditor
          // 다른 글의 수정하기로 바로 옮겨 가도 입력값을 새로 채운다
          key={postId ?? 'new'}
          ref={editorRef}
          initialValue={post && { title: post.title, content: post.content }}
          onSubmit={handleSubmit}
          onDirtyChange={setIsDirty}
        />
      </main>
      <Modal
        variant="destructive"
        open={isDeleteModalOpen}
        onOpenChange={setIsDeleteModalOpen}
        title={post ? '해당 블로그를 삭제하시겠어요?' : '작성 중인 글을 삭제하시겠어요?'}
        description={
          post ? '삭제된 블로그는 다시 확인할 수 없어요.' : '삭제된 글은 다시 확인할 수 없어요.'
        }
        confirmLabel="삭제하기"
        onConfirm={handleDeleteConfirm}
      />
    </div>
  );
}
