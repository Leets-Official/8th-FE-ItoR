import { useId, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { useBodyScrollLock } from '@/hooks/useBodyScrollLock';
import { useEscapeKey } from '@/hooks/useEscapeKey';
import { cn } from '@/utils/cn';

interface ModalProps {
  onClose: () => void;
  /** titleId를 모달 제목 요소의 id로 달아야 스크린 리더가 제목을 읽는다. */
  children: (titleId: string) => ReactNode;
  className?: string;
}

/**
 * 모든 모달이 공유하는 뼈대: 배경 딤, Esc/배경 클릭으로 닫기, 스크롤 잠금.
 * body 바로 아래에 렌더링해서 부모의 overflow/z-index 영향을 받지 않게 한다.
 */
function Modal({ onClose, children, className }: ModalProps) {
  const titleId = useId();
  useEscapeKey(onClose);
  useBodyScrollLock();

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex animate-fade-in items-center justify-center bg-black/40 px-4"
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className={cn('w-full shadow-xl', className)}
      >
        {children(titleId)}
      </div>
    </div>,
    document.body,
  );
}

export default Modal;
