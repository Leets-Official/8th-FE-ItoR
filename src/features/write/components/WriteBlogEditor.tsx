import { ArticleEditorSection } from '../sections/ArticleEditorSection';
import { WriteTitleSection } from '../sections/WriteTitleSection';
import { useArticleEditor } from '../hooks/useArticleEditor';
import { useWriteBlogSubmit } from '../hooks/useWriteBlogSubmit';
import { WRITE_BLOG_FORM_ID } from '../model/writeBlog';
import { WriteMediaToolbar } from './WriteMediaToolbar';
import type { ArticleBlock } from '../model/article';

const WRITE_MEDIA_ACTIONS = ['photo'] as const;

type WriteBlogEditorProps = {
  postId?: string;
  initialTitle?: string;
  initialBlocks?: readonly ArticleBlock[];
};

export function WriteBlogEditor({ postId, initialTitle, initialBlocks }: WriteBlogEditorProps) {
  const {
    blocks,
    focusTextBlockId,
    imageInputRef,
    openImagePicker,
    handleImageChange,
    updateTextBlock,
    updateInsertionPoint,
    removeImageBlock,
  } = useArticleEditor(initialBlocks);
  const { submitWriteBlog, isSubmitting } = useWriteBlogSubmit(blocks, postId);

  return (
    <>
      <WriteMediaToolbar actions={WRITE_MEDIA_ACTIONS} onAction={openImagePicker} />
      <input
        ref={imageInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        multiple
        onChange={handleImageChange}
      />

      <form
        id={WRITE_BLOG_FORM_ID}
        className="w-full"
        aria-busy={isSubmitting}
        onSubmit={submitWriteBlog}
      >
        <WriteTitleSection initialTitle={initialTitle} />
        <ArticleEditorSection
          blocks={blocks}
          focusTextBlockId={focusTextBlockId}
          onTextChange={updateTextBlock}
          onTextSelectionChange={updateInsertionPoint}
          onRemoveImage={removeImageBlock}
        />
      </form>
    </>
  );
}
