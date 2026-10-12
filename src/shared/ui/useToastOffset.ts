import { useEffect } from 'react';

export const TOAST_OFFSET_TOP_VAR = '--toast-offset-top';

// 앱에 하나뿐인 <Toaster />의 위쪽 여백을 이 페이지에 있는 동안만 바꾼다
// Toaster가 페이지 바깥(App.tsx)에 있어 props 대신 :root의 CSS 변수로 전달한다
export function useToastOffset(offsetTop: number) {
  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty(TOAST_OFFSET_TOP_VAR, `${offsetTop}px`);
    return () => {
      root.style.removeProperty(TOAST_OFFSET_TOP_VAR);
    };
  }, [offsetTop]);
}
