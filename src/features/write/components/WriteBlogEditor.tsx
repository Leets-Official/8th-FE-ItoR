import { ArticleEditorSection } from '../sections/ArticleEditorSection';
import { WriteTitleSection } from '../sections/WriteTitleSection';
import { useArticleEditor } from '../hooks/useArticleEditor';
import { useWriteBlogSubmit } from '../hooks/useWriteBlogSubmit';
import { WRITE_BLOG_FORM_ID } from '../model/writeBlog';
import { WriteMediaToolbar } from './WriteMediaToolbar';

const WRITE_MEDIA_ACTIONS = ['photo'] as const;

export function WriteBlogEditor() {
  const { submitWriteBlog } = useWriteBlogSubmit();
  const {
    blocks,
    focusTextBlockId,
    imageInputRef,
    openImagePicker,
    handleImageChange,
    updateTextBlock,
    updateInsertionPoint,
    removeImageBlock,
  } = useArticleEditor();

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

      <form id={WRITE_BLOG_FORM_ID} className="w-full" onSubmit={submitWriteBlog}>
        <WriteTitleSection />
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
