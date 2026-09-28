import { useEffect, useEffectEvent } from 'react';

/** 활성화된 동안 Esc 키를 누르면 onEscape를 호출한다. (모달, 사이드바, 드롭다운 닫기) */
export const useEscapeKey = (onEscape: () => void, isEnabled = true) => {
  // 매 렌더마다 새로 만들어지는 onEscape 때문에 리스너를 다시 등록하지 않도록 Effect Event로 감싼다.
  const handleEscape = useEffectEvent(onEscape);

  useEffect(() => {
    if (!isEnabled) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') handleEscape();
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isEnabled]);
};
