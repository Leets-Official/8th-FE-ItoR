import { ArticleSection } from '@/features/write/components/ArticleSection';
import { TitleSection } from '@/features/write/components/TitleSection';
import { useArticleEditor } from '@/features/write/hooks/useArticleEditor';
import { useWriteBlogSubmit } from '@/features/write/hooks/useWriteBlogSubmit';
import { WRITE_BLOG_FORM_ID } from '@/features/write/model/writeBlog';
import { AddHeader } from '@/shared/ui/header/AddHeader';

const WRITE_HEADER_ACTIONS = ['photo'] as const;

/** @returns 블로그 글 작성 UI가 배치될 반응형 콘텐츠 틀 */
function WriteBlogPage() {
  const { submitWriteBlog } = useWriteBlogSubmit();
  const {
    blocks,
    focusTextBlockId,
    imageInputRef,
    openImagePicker,
    handleImageChange,
    updateTextBlock,
    removeImageBlock,
  } = useArticleEditor();

  return (
    <section className="flex h-fit w-full flex-col items-center">
      <AddHeader actions={WRITE_HEADER_ACTIONS} onAction={openImagePicker} />
      <input
        ref={imageInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        multiple
        onChange={handleImageChange}
      />

      <form id={WRITE_BLOG_FORM_ID} className="w-full" onSubmit={submitWriteBlog}>
        <TitleSection />
        <ArticleSection
          blocks={blocks}
          focusTextBlockId={focusTextBlockId}
          onTextChange={updateTextBlock}
          onRemoveImage={removeImageBlock}
        />
      </form>
    </section>
  );
}

export default WriteBlogPage;
