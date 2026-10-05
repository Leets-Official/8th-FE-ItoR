import { useId, type MouseEvent } from 'react';
import { createPortal } from 'react-dom';

type DialogButtonProps = {
  variant: 'cancel' | 'negative' | 'point';
  text: string;
  onClick?: () => void;
};

const dialogButtonStyles = {
  cancel: 'bg-white text-black',
  negative: 'bg-negative text-white',
  point: 'bg-point text-white',
};

function DialogButton({ variant, text, onClick }: DialogButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`text-14-regular flex h-fit w-full items-center justify-center gap-2 rounded-[2px] border border-gray-96 px-3 py-2 ${dialogButtonStyles[variant]}`}
    >
      {text}
    </button>
  );
}

export type ActionDialogProps = {
  /** 대화상자의 핵심 질문 또는 결과 문구입니다. */
  title: string;
  /** 제목 아래에 표시할 선택 설명입니다. */
  description?: string;
  /** 왼쪽 취소 버튼 문구입니다. */
  cancelLabel: string;
  /** 오른쪽 확인 버튼 문구입니다. */
  confirmLabel: string;
  /** 확인 동작의 의미에 맞는 강조 색상입니다. */
  confirmVariant?: 'negative' | 'point';
  /** 취소 버튼 또는 딤드 영역을 눌렀을 때 실행합니다. */
  onCancel: () => void;
  /** 확인 버튼을 눌렀을 때 실행합니다. */
  onConfirm: () => void;
};

/** 취소와 확인이 필요한 작업에 사용하는 전역 대화상자입니다. 딤드 클릭도 취소로 처리합니다. */
export function ActionDialog({
  title,
  description,
  cancelLabel,
  confirmLabel,
  confirmVariant = 'negative',
  onCancel,
  onConfirm,
}: ActionDialogProps) {
  const titleId = useId();
  const descriptionId = useId();

  function handleBackdropClick(event: MouseEvent<HTMLDivElement>) {
    if (event.target === event.currentTarget) {
      onCancel();
    }
  }

  return createPortal(
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-[rgba(182,182,182,0.3)] backdrop-blur-[4px]"
      onClick={handleBackdropClick}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={description ? descriptionId : undefined}
        className="flex h-fit w-[326px] flex-col gap-6 rounded-[4px] bg-white px-4 pb-4 pt-6 shadow-[0_2px_8px_rgba(0,0,0,0.1)]"
      >
        <div className="flex h-fit w-full flex-col gap-2 rounded-xl px-1">
          <span id={titleId} className="text-14-regular line-clamp-2 w-full text-black">
            {title}
          </span>
          {description ? (
            <span id={descriptionId} className="text-12-regular line-clamp-2 w-full text-gray-56">
              {description}
            </span>
          ) : null}
        </div>

        <div className="flex h-fit w-full items-center justify-center gap-3">
          <DialogButton variant="cancel" text={cancelLabel} onClick={onCancel} />
          <DialogButton variant={confirmVariant} text={confirmLabel} onClick={onConfirm} />
        </div>
      </div>
    </div>,
    document.body,
  );
}
