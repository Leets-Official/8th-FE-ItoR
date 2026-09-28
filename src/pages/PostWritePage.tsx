import { useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import Button from '@/components/common/Button';
import ConfirmModal from '@/components/common/ConfirmModal';
import Header from '@/components/layout/Header';
import EditorBlockItem from '@/components/post/editor/EditorBlockItem';
import PostEditorToolbar from '@/components/post/editor/PostEditorToolbar';
import { ROUTES } from '@/constants/routes';
import { usePostEditor } from '@/hooks/usePostEditor';
import { useToast } from '@/hooks/useToast';
import { getMockPostDetail } from '@/mocks/posts';
import { isBlank } from '@/utils/validators';

/** 새 글 작성(/write)과 수정(/posts/:postId/edit)에 같이 쓰는 페이지 */
function PostWritePage() {
  const { postId } = useParams();
  const editingPost = postId ? getMockPostDetail(Number(postId)) : null;
  const { title, setTitle, blocks, updateBlock, addImage, removeBlock, toContents } = usePostEditor(
    editingPost?.title,
    editingPost?.contents,
  );
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [isDiscardModalOpen, setIsDiscardModalOpen] = useState(false);

  const publishPost = () => {
    if (isBlank(title) || toContents().length === 0) {
      showToast('error', '내용을 입력해주세요');
      return;
    }
    // 3주차: toContents() 결과를 게시물 작성/수정 API로 전송한다.
    showToast('success', '저장되었습니다!');
    navigate(editingPost ? ROUTES.POST_DETAIL(editingPost.id) : ROUTES.HOME);
  };

  return (
    <>
      <Header
        actions={
          <>
            <Button variant="text-danger" onClick={() => setIsDiscardModalOpen(true)}>
              삭제하기
            </Button>
            <Button variant="text-strong" onClick={publishPost}>
              게시하기
            </Button>
          </>
        }
      />
      <PostEditorToolbar onAddImage={addImage} />

      <main>
        <h1 className="sr-only">{editingPost ? '깃로그 수정' : '깃로그 작성'}</h1>
        <div className="border-b border-gray-50">
          <div className="mx-auto max-w-[680px] px-4 py-8 md:py-10">
            <label htmlFor="post-title" className="sr-only">
              제목
            </label>
            <input
              id="post-title"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="제목"
              className="w-full text-2xl font-medium text-ink outline-none placeholder:text-gray-400"
            />
          </div>
        </div>
        <div className="mx-auto flex max-w-[680px] flex-col gap-4 px-4 py-8">
          {blocks.map((block, index) => (
            <EditorBlockItem
              key={block.id}
              block={block}
              isFirst={index === 0}
              onChange={(value) => updateBlock(block.id, value)}
              onRemove={() => removeBlock(block.id)}
            />
          ))}
        </div>
      </main>

      {isDiscardModalOpen && (
        <ConfirmModal
          title="작성 중인 글을 삭제하시겠습니까?"
          description="작성한 내용은 저장되지 않습니다."
          confirmLabel="삭제하기"
          onCancel={() => setIsDiscardModalOpen(false)}
          onConfirm={() => navigate(ROUTES.HOME)}
        />
      )}
    </>
  );
}

export default PostWritePage;
