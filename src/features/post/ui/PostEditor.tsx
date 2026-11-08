import {
  useLayoutEffect,
  useRef,
  useState,
  type ChangeEvent,
  type Ref,
  type SubmitEvent,
} from 'react';
import type { PostContentBlock, PostCreateInput } from '../model/types';
import { uploadImage } from '@/shared/api/uploadImage';
import { cn } from '@/shared/lib/utils';
import { Blank, Button, CompactPageHeader, IconButton, showToast } from '@/shared/ui';

// 입력 중에는 블록마다 key가 필요해 id를 붙여 두고, 제출할 때 뗀다
type EditorBlock = PostContentBlock & { id: string };

// 사진을 넣을 자리. 마지막으로 입력하던 글 블록의 커서 위치
interface Caret {
  blockId: string;
  offset: number;
}

const CONTENT_CLASS = 'w-full max-w-[688px]';
const TEXTAREA_CLASS = 'block w-full resize-none bg-white outline-none field-sizing-content';

function createTextBlock(text = ''): EditorBlock {
  return { id: crypto.randomUUID(), type: 'text', text };
}

// 사진 앞뒤에는 항상 글 칸이 있어야 커서를 두고 이어 쓸 수 있어, 비어 있는 자리에 빈 글 칸을 채운다
function toEditorBlocks(content: PostContentBlock[]): EditorBlock[] {
  const blocks: EditorBlock[] = [];
  for (const block of content) {
    const last = blocks.at(-1);
    if (block.type === 'image' && last?.type !== 'text') blocks.push(createTextBlock());
    // 글이 연달아 오면 한 칸으로 합친다
    if (block.type === 'text' && last?.type === 'text') {
      last.text = [last.text, block.text].filter(Boolean).join('\n');
      continue;
    }
    blocks.push({ ...block, id: crypto.randomUUID() });
  }
  if (blocks.at(-1)?.type !== 'text') blocks.push(createTextBlock());
  return blocks;
}

interface PostEditorProps {
  // 게시하기 버튼이 폼 바깥(헤더)에 있어서, 페이지가 이 ref로 requestSubmit()을 호출해 제출한다
  ref?: Ref<HTMLFormElement>;
  // 수정하기에서 채워 둘 기존 글. 처음 마운트될 때만 읽는다
  initialValue?: PostCreateInput;
  onSubmit: (input: PostCreateInput) => void;
  // 삭제하기를 눌렀을 때 확인을 받을지 정하려고 입력 여부가 바뀔 때마다 알린다
  onDirtyChange?: (isDirty: boolean) => void;
  className?: string;
}

// 글쓰기·수정하기 — 제목과, 글·사진이 번갈아 오는 본문을 입력한다
export function PostEditor({
  ref,
  initialValue,
  onSubmit,
  onDirtyChange,
  className,
}: PostEditorProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const titleRef = useRef<HTMLTextAreaElement>(null);
  // 블록 id로 글 칸을 찾아 포커스를 옮기려고 모아 둔다
  const textareaRefs = useRef(new Map<string, HTMLTextAreaElement>());
  const caretRef = useRef<Caret | null>(null);
  // 렌더링이 끝난 뒤 포커스를 옮길 자리. 합쳐진 글이 화면에 반영되기 전에는 커서를 둘 수 없다
  const pendingFocusRef = useRef<Caret | null>(null);
  const [title, setTitle] = useState(initialValue?.title ?? '');
  const [blocks, setBlocks] = useState<EditorBlock[]>(() =>
    initialValue ? toEditorBlocks(initialValue.content) : [createTextBlock()],
  );

  useLayoutEffect(() => {
    const caret = pendingFocusRef.current;
    if (!caret) return;
    pendingFocusRef.current = null;
    const textarea = textareaRefs.current.get(caret.blockId);
    if (!textarea) return;
    textarea.focus();
    textarea.setSelectionRange(caret.offset, caret.offset);
    // focus 이벤트가 옮기기 전 커서 위치를 저장하므로 다시 맞춘다
    caretRef.current = caret;
  }, [blocks]);

  function updateDirty(nextTitle: string, nextBlocks: EditorBlock[]) {
    onDirtyChange?.(
      nextTitle.length > 0 ||
        nextBlocks.some((block) => block.type === 'image' || block.text.length > 0),
    );
  }

  function changeBlocks(nextBlocks: EditorBlock[]) {
    setBlocks(nextBlocks);
    updateDirty(title, nextBlocks);
  }

  function handleTitleChange(event: ChangeEvent<HTMLTextAreaElement>) {
    // 제목은 한 줄이라 붙여 넣은 줄바꿈은 공백으로 바꾼다
    const nextTitle = event.target.value.replace(/\n/g, ' ');
    setTitle(nextTitle);
    updateDirty(nextTitle, blocks);
  }

  function handleTextChange(blockId: string, event: ChangeEvent<HTMLTextAreaElement>) {
    const { value, selectionStart } = event.target;
    caretRef.current = { blockId, offset: selectionStart };
    changeBlocks(
      blocks.map((block) =>
        block.id === blockId && block.type === 'text' ? { ...block, text: value } : block,
      ),
    );
  }

  function saveCaret(blockId: string, textarea: HTMLTextAreaElement) {
    caretRef.current = { blockId, offset: textarea.selectionStart };
  }

  async function handleImageChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    // 같은 파일을 다시 골라도 change 이벤트가 발생하도록 비운다
    event.target.value = '';
    if (!file) return;

    // 사진을 올리는 동안 커서가 옮겨 갈 수 있어 고른 시점의 위치를 쓴다
    const caret = caretRef.current;
    let imageUrl: string;
    try {
      imageUrl = await uploadImage(file);
    } catch {
      showToast('negative', '사진을 올리지 못했습니다.');
      return;
    }

    const imageId = crypto.randomUUID();
    const afterId = crypto.randomUUID();
    // 커서가 있던 자리에서 글을 둘로 나눠 그 사이에 사진을 넣는다. 입력한 적이 없으면 맨 끝에 넣는다
    // StrictMode에서 updater가 두 번 실행되므로 ref를 바꾸지 않고 id도 바깥에서 만든다
    setBlocks((prev) => {
      const foundIndex = caret ? prev.findIndex(({ id }) => id === caret.blockId) : -1;
      const index = foundIndex === -1 ? prev.length - 1 : foundIndex;
      const target = prev[index];
      if (target.type !== 'text') return prev;
      const offset = foundIndex === -1 || !caret ? target.text.length : caret.offset;

      return [
        ...prev.slice(0, index),
        { ...target, text: target.text.slice(0, offset) },
        { id: imageId, type: 'image', imageUrl },
        { id: afterId, type: 'text', text: target.text.slice(offset) },
        ...prev.slice(index + 1),
      ];
    });
    // 사진 뒤에서 이어 쓰도록 커서를 사진 다음 글 블록 맨 앞으로 옮긴다
    caretRef.current = { blockId: afterId, offset: 0 };
    onDirtyChange?.(true);
  }

  function handleImageRemove(blockId: string) {
    const index = blocks.findIndex(({ id }) => id === blockId);
    const before = blocks[index - 1];
    const after = blocks[index + 1];

    // 사진 앞뒤는 항상 글 블록이라 사진을 빼면 둘을 한 블록으로 합친다
    if (before?.type === 'text' && after?.type === 'text') {
      const joined = [before.text, after.text].filter(Boolean).join('\n');
      // 삭제 버튼이 사진과 함께 사라져 포커스를 잃으므로, 사진이 있던 자리에 커서를 두고 이어 쓰게 한다
      const caret = { blockId: before.id, offset: before.text.length };
      caretRef.current = caret;
      pendingFocusRef.current = caret;
      changeBlocks([
        ...blocks.slice(0, index - 1),
        { ...before, text: joined },
        ...blocks.slice(index + 2),
      ]);
      return;
    }
    changeBlocks(blocks.filter(({ id }) => id !== blockId));
  }

  function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmedTitle = title.trim();
    // 빈 글 블록은 사진을 넣으며 생긴 자리라 저장하지 않는다
    const content: PostContentBlock[] = blocks
      .map((block): PostContentBlock =>
        block.type === 'text'
          ? { type: 'text', text: block.text.trim() }
          : { type: 'image', imageUrl: block.imageUrl },
      )
      .filter((block) => block.type === 'image' || block.text.length > 0);

    if (!trimmedTitle) {
      showToast('negative', '제목을 입력해주세요');
      titleRef.current?.focus();
      return;
    }
    if (content.length === 0) {
      showToast('negative', '본문 내용을 입력해주세요');
      return;
    }

    onSubmit({ title: trimmedTitle, content });
  }

  return (
    <form
      ref={ref}
      className={cn('flex w-full flex-col items-center', className)}
      onSubmit={handleSubmit}
    >
      {/* 긴 글을 쓰다가도 바로 사진을 넣을 수 있게 헤더(72px) 아래에 붙여 둔다 */}
      <CompactPageHeader label="글쓰기 도구" className="sticky top-[72px] z-10">
        <Button
          variant="text"
          icon="add_photo_alternate"
          className="h-[25px] whitespace-nowrap"
          // 버튼이 포커스를 가져가도 커서 위치는 caretRef에 남아 있다
          onClick={() => fileInputRef.current?.click()}
        >
          사진 추가하기
        </Button>
      </CompactPageHeader>
      <input ref={fileInputRef} type="file" accept="image/*" hidden onChange={handleImageChange} />

      {/* 시안: 제목 칸 위아래 48px(36 + 12) 여백 */}
      <section className="flex w-full flex-col items-center border-b border-gray-96 py-9">
        <div className={cn(CONTENT_CLASS, 'px-4 py-3')}>
          <textarea
            ref={titleRef}
            aria-label="제목"
            name="title"
            rows={1}
            placeholder="제목"
            value={title}
            className={cn(
              TEXTAREA_CLASS,
              'text-24 font-medium text-black placeholder:text-gray-56',
            )}
            onChange={handleTitleChange}
            // 제목에서 Enter를 누르면 줄을 바꾸지 않고 본문으로 넘어간다
            onKeyDown={(event) => {
              if (event.key !== 'Enter' || event.nativeEvent.isComposing) return;
              event.preventDefault();
              textareaRefs.current.get(blocks[0].id)?.focus();
            }}
          />
        </div>
      </section>

      <section className="flex w-full flex-col items-center">
        <Blank size={32} />
        <div className={cn(CONTENT_CLASS, 'flex flex-col')}>
          {blocks.map((block) =>
            block.type === 'text' ? (
              <div key={block.id} className="px-4 py-3">
                <textarea
                  aria-label="본문"
                  ref={(textarea) => {
                    if (!textarea) return;
                    textareaRefs.current.set(block.id, textarea);
                    return () => {
                      textareaRefs.current.delete(block.id);
                    };
                  }}
                  // 글이 하나뿐일 때만 안내 문구를 보여준다
                  placeholder={blocks.length === 1 ? '어떠한 것을 깨달았나요?' : undefined}
                  value={block.text}
                  className={cn(
                    TEXTAREA_CLASS,
                    'text-14 font-light text-gray-20 placeholder:text-gray-56',
                    // 첫 글 칸은 화면 아래까지 눌러서 바로 입력할 수 있게 넉넉히 둔다
                    blocks.length === 1 && 'min-h-[50svh]',
                  )}
                  onChange={(event) => handleTextChange(block.id, event)}
                  onSelect={(event) => saveCaret(block.id, event.currentTarget)}
                  onFocus={(event) => saveCaret(block.id, event.currentTarget)}
                />
              </div>
            ) : (
              // 시안: 사진에 마우스를 올리면 테두리가, 눌러서 선택하면 위쪽 가운데에 삭제 말풍선이 뜬다
              // 터치 기기에서도 눌러서 선택할 수 있게 블록 자체를 포커스 가능하게 둔다
              <div
                key={block.id}
                tabIndex={0}
                aria-label="첨부한 사진"
                className="group relative border border-transparent px-4 py-3 outline-none focus-within:border-gray-90 hover:border-gray-90"
              >
                <img src={block.imageUrl} alt="" className="w-full rounded-sm" />
                <div className="invisible absolute bottom-full left-1/2 z-10 -translate-x-1/2 group-focus-within:visible">
                  <div className="rounded-sm bg-white p-2 shadow-[0_2px_8px_rgba(0,0,0,0.1)]">
                    <IconButton
                      icon="delete_forever"
                      label="사진 삭제"
                      onClick={() => handleImageRemove(block.id)}
                    />
                  </div>
                  {/* 말풍선 꼬리 — 사진을 가리키도록 아래로 뾰족하게 */}
                  <div className="mx-auto -mt-1.5 size-3 rotate-45 bg-white shadow-[2px_2px_4px_rgba(0,0,0,0.06)]" />
                </div>
              </div>
            ),
          )}
        </div>
        <Blank size={64} />
      </section>
    </form>
  );
}
