import { useEffect } from 'react';

/** 모달/사이드바가 열려 있는 동안 뒤 페이지가 스크롤되지 않게 막는다. */
export const useBodyScrollLock = (isLocked = true) => {
  useEffect(() => {
    if (!isLocked) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isLocked]);
};
