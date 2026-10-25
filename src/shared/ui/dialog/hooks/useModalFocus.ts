import { useEffect, useRef, type RefObject } from 'react';

const FOCUSABLE_SELECTOR = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(',');

const modalStack: symbol[] = [];
let scrollLockCount = 0;
let previousBodyOverflow = '';

function lockBodyScroll() {
  if (scrollLockCount === 0) {
    previousBodyOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
  }

  scrollLockCount += 1;
}

function unlockBodyScroll() {
  scrollLockCount = Math.max(0, scrollLockCount - 1);

  if (scrollLockCount === 0) {
    document.body.style.overflow = previousBodyOverflow;
  }
}

/** 열린 모달 안에 포커스를 유지하고 Escape 닫기와 이전 포커스 복원을 처리합니다. */
export function useModalFocus<T extends HTMLElement>(onDismiss: () => void, enabled = true) {
  const containerRef = useRef<T>(null);
  const onDismissRef = useRef(onDismiss);

  useEffect(() => {
    onDismissRef.current = onDismiss;
  }, [onDismiss]);

  useEffect(() => {
    if (!enabled) {
      return;
    }

    const modalId = Symbol('modal');
    const previouslyFocusedElement = document.activeElement as HTMLElement | null;
    const container = containerRef.current;
    modalStack.push(modalId);
    lockBodyScroll();

    const firstFocusableElement = container?.querySelector<HTMLElement>(FOCUSABLE_SELECTOR);
    window.requestAnimationFrame(() => (firstFocusableElement ?? container)?.focus());

    function handleKeyDown(event: KeyboardEvent) {
      if (modalStack.at(-1) !== modalId) {
        return;
      }

      if (event.key === 'Escape') {
        event.preventDefault();
        onDismissRef.current();
        return;
      }

      if (event.key !== 'Tab' || !container) {
        return;
      }

      const focusableElements = Array.from(
        container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR),
      );

      if (focusableElements.length === 0) {
        event.preventDefault();
        container.focus();
        return;
      }

      const firstElement = focusableElements[0];
      const lastElement = focusableElements.at(-1);

      if (event.shiftKey && document.activeElement === firstElement) {
        event.preventDefault();
        lastElement?.focus();
      } else if (!event.shiftKey && document.activeElement === lastElement) {
        event.preventDefault();
        firstElement.focus();
      }
    }

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      const modalIndex = modalStack.indexOf(modalId);
      if (modalIndex >= 0) {
        modalStack.splice(modalIndex, 1);
      }
      unlockBodyScroll();
      previouslyFocusedElement?.focus();
    };
  }, [enabled]);

  return containerRef as RefObject<T>;
}
