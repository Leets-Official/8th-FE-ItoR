import { useEditBlogPost } from '../hooks/useEditBlogPost';
import { WriteBlogEditor } from './WriteBlogEditor';

type EditBlogEditorProps = {
  postId: string;
};

/** 기존 게시글을 불러온 뒤 작성 화면과 같은 블록 편집 UI를 표시합니다. */
export function EditBlogEditor({ postId }: EditBlogEditorProps) {
  const { editablePost, isLoading, errorMessage } = useEditBlogPost(postId);

  if (isLoading) {
    return (
      <p role="status" className="text-14-light px-4 py-12 text-gray-56">
        게시글을 불러오고 있습니다.
      </p>
    );
  }

  if (!editablePost) {
    return (
      <p role="alert" className="text-14-light px-4 py-12 text-negative">
        {errorMessage || '게시글을 불러오지 못했습니다.'}
      </p>
    );
  }

  return (
    <WriteBlogEditor
      postId={postId}
      initialTitle={editablePost.title}
      initialBlocks={editablePost.blocks}
    />
  );
}
