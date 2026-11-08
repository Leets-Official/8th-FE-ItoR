import { useEffect, useRef, useState, type ChangeEvent, type SubmitEvent } from 'react';

import { AddPhotoAlternateIcon, ClearIcon } from '@/shared/assets/icons';
import { getApiErrorMessage } from '@/shared/apis/response';
import { IconButton } from '@/shared/ui/IconButton';
import { Button } from '@/shared/ui/primitives/button';
import { notify } from '@/shared/ui/StatusToast';

import { usePostImageUploadMutation } from '../api/usePostImageUploadMutation';
import { getPostDraftError, insertPostImage, readPostImage } from '../lib/postDraft';
import type { PostDraft, PostDraftBlock } from '../model/postDraft';

interface PostEditorProps {
  initialDraft?: PostDraft;
  onPublish: (draft: PostDraft) => Promise<void>;
  submitting?: boolean;
}

export function PostEditor({ initialDraft, onPublish, submitting = false }: PostEditorProps) {
  const [title, setTitle] = useState(initialDraft?.title ?? '');
  const [blocks, setBlocks] = useState<PostDraftBlock[]>(
    initialDraft?.blocks ?? [{ id: 'first-text', type: 'text', text: '' }],
  );
  const [loadingImage, setLoadingImage] = useState(false);
  const titleInput = useRef<HTMLInputElement>(null);
  const fileInput = useRef<HTMLInputElement>(null);
  const form = useRef<HTMLFormElement>(null);
  const insertion = useRef({ id: 'first-text', start: 0, end: 0 });
  const imageAbort = useRef<AbortController | null>(null);
  const submittingRef = useRef(false);
  const imageRequest = useRef(0);
  const uploadImage = usePostImageUploadMutation();

  useEffect(() => {
    return () => {
      imageRequest.current += 1;
      imageAbort.current?.abort();
    };
  }, []);

  function captureSelection(input: HTMLTextAreaElement, id: string) {
    insertion.current = { id, start: input.selectionStart, end: input.selectionEnd };
  }

  async function addPhoto(event: ChangeEvent<HTMLInputElement>) {
    if (submitting || submittingRef.current) return;
    const file = event.currentTarget.files?.[0];
    event.currentTarget.value = '';
    if (!file) return;
    const request = ++imageRequest.current;
    const controller = new AbortController();
    imageAbort.current = controller;
    let previewUrl: string | undefined;
    const { id, start, end } = insertion.current;
    setLoadingImage(true);
    try {
      const image = await readPostImage(file);
      previewUrl = image.src;
      if (request !== imageRequest.current) return;
      const imageUrl = await uploadImage.mutateAsync({ file, signal: controller.signal });
      if (request !== imageRequest.current) return;
      const nextId = crypto.randomUUID();
      setBlocks((previous) =>
        insertPostImage(
          previous,
          id,
          start,
          end,
          { ...image, src: imageUrl, id: crypto.randomUUID(), type: 'image' },
          nextId,
        ),
      );
      insertion.current = { id: nextId, start: 0, end: 0 };
    } catch (error) {
      if (request === imageRequest.current)
        notify.error(getApiErrorMessage(error, '사진을 업로드하지 못했습니다. 다시 선택해주세요.'));
    } finally {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
      if (imageAbort.current === controller) imageAbort.current = null;
      if (request === imageRequest.current) setLoadingImage(false);
      uploadImage.reset();
    }
  }

  function removePhoto(id: string) {
    setBlocks((previous) => previous.filter((block) => block.id !== id));
  }

  async function submit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submitting || submittingRef.current) return;
    if (loadingImage) {
      notify.error('사진 업로드가 끝난 뒤 저장해주세요.');
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
    submittingRef.current = true;
    try {
      await onPublish(draft);
    } catch (error) {
      notify.error(getApiErrorMessage(error));
    } finally {
      submittingRef.current = false;
    }
  }

  function clearDraft() {
    imageRequest.current += 1;
    imageAbort.current?.abort();
    setLoadingImage(false);
    setTitle('');
    setBlocks([{ id: 'first-text', type: 'text', text: '' }]);
    insertion.current = { id: 'first-text', start: 0, end: 0 };
    titleInput.current?.focus();
  }

  return (
    <main className="font-auth">
      <h1 className="sr-only">{initialDraft ? '게시글 수정' : '게시글 작성'}</h1>
      <div className="flex justify-center bg-white/90 px-4 py-3 shadow-[0px_4px_4px_0px_rgba(0,0,0,0.01)] backdrop-blur-[2px]">
        <Button
          type="button"
          variant={null}
          disabled={loadingImage || submitting}
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
          disabled={loadingImage || submitting}
          aria-label="본문 사진 선택"
          onChange={addPhoto}
          className="sr-only"
          tabIndex={-1}
        />
      </div>
      <form
        id="post-editor"
        ref={form}
        onSubmit={submit}
        onReset={(event) => {
          event.preventDefault();
          if (!submitting && !submittingRef.current) clearDraft();
        }}
        aria-busy={submitting}
      >
        <fieldset disabled={submitting} className="min-w-0">
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
            {submitting && (
              <p role="status" className="px-4 text-xs text-neutral-400">
                게시물을 저장하고 있습니다.
              </p>
            )}
            {loadingImage && (
              <p role="status" className="px-4 text-xs text-neutral-400">
                사진을 업로드하고 있습니다.
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
                      type="button"
                      label={`${block.alt} 사진 삭제`}
                      onClick={() => removePhoto(block.id)}
                      className="absolute top-2 right-2 rounded-full bg-white/90"
                    >
                      <ClearIcon aria-hidden="true" />
                    </IconButton>
                  </figure>
                )}
              </div>
            ))}
          </div>
        </fieldset>
      </form>
    </main>
  );
}
