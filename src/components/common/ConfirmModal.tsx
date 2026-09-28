import Button from './Button';
import Modal from './Modal';

interface ConfirmModalProps {
  title: string;
  description?: string;
  cancelLabel?: string;
  confirmLabel: string;
  /** 삭제처럼 되돌릴 수 없는 동작이면 danger, 이동/안내면 point */
  confirmTone?: 'danger' | 'point';
  onCancel: () => void;
  onConfirm: () => void;
}

function ConfirmModal({
  title,
  description,
  cancelLabel = '취소',
  confirmLabel,
  confirmTone = 'danger',
  onCancel,
  onConfirm,
}: ConfirmModalProps) {
  return (
    <Modal onClose={onCancel} className="max-w-72 rounded-sm bg-white p-4">
      {(titleId) => (
        <>
          <h2 id={titleId} className="text-sm leading-relaxed whitespace-pre-line text-ink">
            {title}
          </h2>
          {description && (
            <p className="mt-2 text-xs leading-relaxed whitespace-pre-line text-gray-500">
              {description}
            </p>
          )}
          <div className="mt-5 grid grid-cols-2 gap-1.5">
            <Button variant="white" size="md" onClick={onCancel}>
              {cancelLabel}
            </Button>
            <Button
              variant={confirmTone === 'danger' ? 'danger' : 'solid-point'}
              size="md"
              onClick={onConfirm}
              autoFocus
            >
              {confirmLabel}
            </Button>
          </div>
        </>
      )}
    </Modal>
  );
}

export default ConfirmModal;
