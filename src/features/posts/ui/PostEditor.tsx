import { useEffect, useRef, useState, type ChangeEvent, type SubmitEvent } from 'react';

import { AddPhotoAlternateIcon, ClearIcon } from '@/shared/assets/icons';
import { IconButton } from '@/shared/ui/IconButton';
import { Button } from '@/shared/ui/primitives/button';
import { notify } from '@/shared/ui/StatusToast';

import { getPostDraftError, insertPostImage, readPostImage } from '../lib/postDraft';
import type { PostDraft, PostDraftBlock } from '../model/postDraft';

interface PostEditorProps {
  onPublish: (draft: PostDraft) => boolean;
  trackImage: (url: string) => void;
  releaseImage: (url: string) => void;
}

export function PostEditor({ onPublish, trackImage, releaseImage }: PostEditorProps) {
  const [title, setTitle] = useState('');
  const [blocks, setBlocks] = useState<PostDraftBlock[]>([
    { id: 'first-text', type: 'text', text: '' },
  ]);
  const [loadingImage, setLoadingImage] = useState(false);
  const titleInput = useRef<HTMLInputElement>(null);
  const fileInput = useRef<HTMLInputElement>(null);
  const form = useRef<HTMLFormElement>(null);
  const insertion = useRef({ id: 'first-text', start: 0, end: 0 });
  const imageUrls = useRef(new Set<string>());
  const published = useRef(false);
  const imageRequest = useRef(0);

  useEffect(() => {
    const urls = imageUrls.current;
    return () => {
      imageRequest.current += 1;
      if (!published.current) urls.forEach(releaseImage);
    };
  }, [releaseImage]);

  function captureSelection(input: HTMLTextAreaElement, id: string) {
    insertion.current = { id, start: input.selectionStart, end: input.selectionEnd };
  }

  async function addPhoto(event: ChangeEvent<HTMLInputElement>) {
    const file = event.currentTarget.files?.[0];
    event.currentTarget.value = '';
    if (!file) return;
    const request = ++imageRequest.current;
    setLoadingImage(true);
    try {
      const image = await readPostImage(file);
      if (request !== imageRequest.current) {
        URL.revokeObjectURL(image.src);
        return;
      }
      trackImage(image.src);
      imageUrls.current.add(image.src);
      const nextId = crypto.randomUUID();
      const { id, start, end } = insertion.current;
      setBlocks((previous) =>
        insertPostImage(
          previous,
          id,
          start,
          end,
          { ...image, id: crypto.randomUUID(), type: 'image' },
          nextId,
        ),
      );
      insertion.current = { id: nextId, start: 0, end: 0 };
    } catch (error) {
      if (request === imageRequest.current)
        notify.error(error instanceof Error ? error.message : '이미지를 불러올 수 없습니다.');
    } finally {
      if (request === imageRequest.current) setLoadingImage(false);
    }
  }

  function removePhoto(id: string, src: string) {
    setBlocks((previous) => previous.filter((block) => block.id !== id));
    imageUrls.current.delete(src);
    releaseImage(src);
  }

  function submit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    if (loadingImage) {
      notify.error('사진을 불러오는 중입니다.');
      return;
    }
    const draft = { title, blocks };
    const error = getPostDraftError(draft);
    if (error) {
      notify.error(error === 'title' ? '제목을 입력해주세요' : '내용을 입력해주세요');
      if (error === 'title') titleInput.current?.focus();
      else form.current?.querySelector('textarea')?.focus();
      return;
    }
    if (onPublish(draft)) published.current = true;
  }

  function clearDraft() {
    imageRequest.current += 1;
    setLoadingImage(false);
    imageUrls.current.forEach(releaseImage);
    imageUrls.current.clear();
    setTitle('');
    setBlocks([{ id: 'first-text', type: 'text', text: '' }]);
    insertion.current = { id: 'first-text', start: 0, end: 0 };
    titleInput.current?.focus();
  }

  return (
    <main className="font-auth">
      <h1 className="sr-only">게시글 작성</h1>
      <div className="flex justify-center bg-white/90 px-4 py-3 shadow-[0px_4px_4px_0px_rgba(0,0,0,0.01)] backdrop-blur-[2px]">
        <Button
          type="button"
          variant={null}
          disabled={loadingImage}
          onClick={() => fileInput.current?.click()}
          className="h-auto gap-1 rounded-xs px-2 pt-0.5 pb-1 text-xs leading-5 font-normal text-neutral-400"
        >
          <AddPhotoAlternateIcon aria-hidden="true" className="size-3.5 opacity-50" />
          사진 추가하기
        </Button>
        <input
          ref={fileInput}
          type="file"
          accept="image/*"
          aria-label="본문 사진 선택"
          onChange={addPhoto}
          className="sr-only"
          tabIndex={-1}
        />
      </div>
      <form id="post-editor" ref={form} onSubmit={submit} onReset={clearDraft}>
        <div className="border-b border-neutral-100">
          <div className="mx-auto w-full max-w-[688px] pt-5 sm:pt-8">
            <div className="py-3">
              <label htmlFor="post-title" className="sr-only">
                제목
              </label>
              <div className="px-4 py-3">
                <input
                  id="post-title"
                  ref={titleInput}
                  value={title}
                  onChange={(event) => setTitle(event.target.value)}
                  placeholder="제목"
                  className="w-full rounded-xs text-2xl leading-10 font-medium text-black placeholder:text-neutral-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gitlog-action sm:text-base sm:leading-6"
                />
              </div>
              <div className="h-5 sm:h-8" />
            </div>
          </div>
        </div>
        <div className="mx-auto min-h-[calc(100dvh-280px)] w-full max-w-[688px] py-5 sm:py-8">
          {loadingImage && (
            <p role="status" className="px-4 text-xs text-neutral-400">
              사진을 불러오고 있습니다.
            </p>
          )}
          {blocks.map((block, index) => (
            <div key={block.id} className="px-4 py-3">
              {block.type === 'text' ? (
                <textarea
                  aria-label={`본문 ${index + 1}`}
                  rows={1}
                  value={block.text}
                  placeholder={
                    index === 0 ? '어떠한 것을 깨달았나요?' : '내용을 이어서 작성하세요.'
                  }
                  onFocus={(event) => captureSelection(event.currentTarget, block.id)}
                  onSelect={(event) => captureSelection(event.currentTarget, block.id)}
                  onChange={(event) => {
                    const text = event.currentTarget.value;
                    setBlocks((previous) =>
                      previous.map((item) => (item.id === block.id ? { ...item, text } : item)),
                    );
                    captureSelection(event.currentTarget, block.id);
                  }}
                  className="block [field-sizing:content] min-h-6 w-full resize-none rounded-xs text-sm leading-6 font-light text-zinc-800 placeholder:text-neutral-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gitlog-action"
                />
              ) : (
                <figure className="relative">
                  <img
                    src={block.src}
                    alt={block.alt}
                    width={block.width}
                    height={block.height}
                    className="h-auto w-full rounded-sm"
                  />
                  <IconButton
                    label={`${block.alt} 사진 삭제`}
                    onClick={() => removePhoto(block.id, block.src)}
                    className="absolute top-2 right-2 rounded-full bg-white/90"
                  >
                    <ClearIcon aria-hidden="true" />
                  </IconButton>
                </figure>
              )}
            </div>
          ))}
        </div>
      </form>
    </main>
  );
}
