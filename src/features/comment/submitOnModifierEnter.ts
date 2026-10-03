import type { KeyboardEvent } from 'react';

// Enter는 줄바꿈 그대로 두고 Cmd(macOS)·Ctrl+Enter로 등록한다. 한글 조합 중 Enter는 조합 확정용이라 등록하지 않는다
export function submitOnModifierEnter(event: KeyboardEvent<HTMLTextAreaElement>) {
  const hasModifier = event.metaKey || event.ctrlKey;
  if (event.key !== 'Enter' || !hasModifier || event.nativeEvent.isComposing) return;

  event.preventDefault();
  event.currentTarget.form?.requestSubmit();
}
