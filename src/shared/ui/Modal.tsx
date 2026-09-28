import type { MouseEventHandler, ReactNode } from 'react';
import { AlertDialog as AlertDialogPrimitive } from 'radix-ui';
import { cn } from '@/shared/lib/utils';

interface ModalProps {
  title: ReactNode;
  description?: ReactNode;
  cancelLabel?: ReactNode;
  confirmLabel?: ReactNode;
  // 모달을 여는 요소. 없으면 open/onOpenChange로 바깥에서 열고 닫는다
  trigger?: ReactNode;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  onCancel?: MouseEventHandler<HTMLButtonElement>;
  onConfirm?: MouseEventHandler<HTMLButtonElement>;
  className?: string;
}

// shadcn/ui alert-dialog 기반 — 포커스 가두기, ESC 닫기, 스크롤 잠금, 닫힌 뒤 트리거로 포커스 복귀는 Radix가 처리한다
// 취소·확인 버튼을 누르면 onCancel/onConfirm 호출 후 자동으로 닫힌다 (onOpenChange(false))
export function Modal({
  title,
  description,
  cancelLabel = '취소',
  confirmLabel = '삭제하기',
  trigger,
  open,
  defaultOpen,
  onOpenChange,
  onCancel,
  onConfirm,
  className,
}: ModalProps) {
  return (
    <AlertDialogPrimitive.Root open={open} defaultOpen={defaultOpen} onOpenChange={onOpenChange}>
      {trigger && <AlertDialogPrimitive.Trigger asChild>{trigger}</AlertDialogPrimitive.Trigger>}
      <AlertDialogPrimitive.Portal>
        <AlertDialogPrimitive.Overlay className="fixed inset-0 z-50 bg-black/40 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:animate-in data-[state=open]:fade-in-0" />
        <AlertDialogPrimitive.Content
          // 설명이 없을 때 Radix의 Description 누락 경고를 끈다
          {...(description ? {} : { 'aria-describedby': undefined })}
          className={cn(
            'fixed top-1/2 left-1/2 z-50 flex w-[326px] -translate-x-1/2 -translate-y-1/2 flex-col items-start gap-6 rounded-sm bg-white px-4 pt-6 pb-4 shadow-[0_2px_8px_rgba(0,0,0,0.1)] data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95',
            className,
          )}
        >
          <div className="flex w-full flex-col items-start gap-2 rounded-xl px-1">
            <AlertDialogPrimitive.Title className="flex min-h-11 w-full items-center text-14 font-normal text-black">
              <span>{title}</span>
            </AlertDialogPrimitive.Title>
            {description && (
              <AlertDialogPrimitive.Description className="flex min-h-[38px] w-full items-center text-12 text-gray-56">
                <span>{description}</span>
              </AlertDialogPrimitive.Description>
            )}
          </div>
          <div className="flex h-[38px] w-full items-center gap-3">
            <AlertDialogPrimitive.Cancel
              onClick={onCancel}
              className="flex h-[38px] flex-1 cursor-pointer items-center justify-center rounded-xs border border-gray-96 px-3 py-2 text-14 text-black hover:bg-gray-90 active:bg-gray-90"
            >
              {cancelLabel}
            </AlertDialogPrimitive.Cancel>
            <AlertDialogPrimitive.Action
              onClick={onConfirm}
              className="flex h-[38px] flex-1 cursor-pointer items-center justify-center rounded-xs bg-negative px-3 py-2 text-14 text-white hover:brightness-95 active:brightness-90"
            >
              {confirmLabel}
            </AlertDialogPrimitive.Action>
          </div>
        </AlertDialogPrimitive.Content>
      </AlertDialogPrimitive.Portal>
    </AlertDialogPrimitive.Root>
  );
}
