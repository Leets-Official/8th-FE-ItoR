import { useEffect, useEffectEvent, type RefObject } from 'react';

/** ref 요소 바깥을 클릭하면 onOutsideClick을 호출한다. (드롭다운 메뉴 닫기) */
export const useOutsideClick = (
  ref: RefObject<HTMLElement | null>,
  onOutsideClick: () => void,
  isEnabled = true,
) => {
  const handleOutsideClick = useEffectEvent(onOutsideClick);

  useEffect(() => {
    if (!isEnabled) return;

    const handlePointerDown = (event: PointerEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) handleOutsideClick();
    };

    document.addEventListener('pointerdown', handlePointerDown);
    return () => document.removeEventListener('pointerdown', handlePointerDown);
  }, [ref, isEnabled]);
};
