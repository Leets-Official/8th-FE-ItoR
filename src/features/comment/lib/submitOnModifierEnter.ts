import type { KeyboardEvent } from 'react';

// Enter는 줄바꿈 그대로 두고 Cmd(macOS)·Ctrl+Enter로 등록한다
export function submitOnModifierEnter(event: KeyboardEvent<HTMLTextAreaElement>) {
  const hasModifier = event.metaKey || event.ctrlKey;
  if (event.key !== 'Enter' || !hasModifier) return;

  const textarea = event.currentTarget;
  // 한글 조합 중에는 이 키 입력이 마지막 글자 확정에 쓰인다. 바로 제출하면 마지막 글자가 빠지므로
  // 조합이 끝나고 입력값이 state에 반영된 다음 틱에 제출해 한 번만 눌러도 등록되게 한다
  if (event.nativeEvent.isComposing) {
    textarea.addEventListener(
      'compositionend',
      () => setTimeout(() => textarea.form?.requestSubmit()),
      {
        once: true,
      },
    );
    return;
  }

  event.preventDefault();
  textarea.form?.requestSubmit();
}
