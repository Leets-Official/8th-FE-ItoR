import type { ComponentProps } from 'react';

import { Button } from '@/shared/ui/primitives/button';
import { cn } from '@/shared/utils/cn';

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/shared/ui/primitives/dialog';

interface ConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  confirmLabel: string;
  confirmVariant?: ComponentProps<typeof Button>['variant'];
  confirmClassName?: string;
  pending?: boolean;
  onConfirm: () => void;
  onCloseAutoFocus?: ComponentProps<typeof DialogContent>['onCloseAutoFocus'];
}

export function ConfirmDialog({
  open,
  onOpenChange,
  title,
  description,
  confirmLabel,
  confirmVariant = 'default',
  confirmClassName,
  pending = false,
  onConfirm,
  onCloseAutoFocus,
}: ConfirmDialogProps) {
  return (
    <Dialog open={open} onOpenChange={(nextOpen) => !pending && onOpenChange(nextOpen)}>
      <DialogContent
        {...(description ? {} : { 'aria-describedby': undefined })}
        showCloseButton={false}
        onCloseAutoFocus={onCloseAutoFocus}
        overlayClassName="bg-zinc-400/30 backdrop-blur-[2px]"
        className="w-80 max-w-[calc(100%-2rem)] gap-6 overflow-hidden rounded-sm bg-white px-4 pt-6 pb-4 font-auth shadow-[0px_2px_8px_0px_rgba(0,0,0,0.10)] ring-0 sm:max-w-80"
      >
        <DialogHeader className="gap-2 px-1 text-left">
          <DialogTitle className="font-auth text-sm leading-6 font-normal whitespace-pre-line text-black">
            {title}
          </DialogTitle>
          {description && (
            <DialogDescription className="text-xs leading-5 whitespace-pre-line text-neutral-400">
              {description}
            </DialogDescription>
          )}
        </DialogHeader>
        <DialogFooter className="mx-0 mb-0 flex-row gap-3 border-0 bg-transparent p-0">
          <DialogClose asChild>
            <Button
              type="button"
              disabled={pending}
              variant="outline"
              className="h-10 flex-1 rounded-xs border-neutral-100 bg-white px-3 py-2 text-sm leading-6 font-normal text-black hover:bg-neutral-50"
            >
              취소
            </Button>
          </DialogClose>
          <Button
            type="button"
            disabled={pending}
            aria-busy={pending}
            variant={confirmVariant}
            onClick={onConfirm}
            className={cn(
              'h-10 flex-1 rounded-xs px-3 py-2 text-sm leading-6 font-normal',
              confirmClassName,
            )}
          >
            {pending ? '처리 중...' : confirmLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
