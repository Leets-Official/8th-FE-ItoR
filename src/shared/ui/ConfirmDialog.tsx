import { Button } from '@/shared/ui/primitives/button';
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
  onConfirm: () => void;
}

export function ConfirmDialog({
  open,
  onOpenChange,
  title,
  description,
  confirmLabel,
  onConfirm,
}: ConfirmDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="max-w-[calc(100%-2rem)] rounded-sm bg-white p-4 sm:max-w-70"
      >
        <DialogHeader className="gap-1 text-left">
          <DialogTitle className="text-sm leading-5 font-normal whitespace-pre-line text-neutral-950">
            {title}
          </DialogTitle>
          {description && (
            <DialogDescription className="text-xs leading-5 whitespace-pre-line text-neutral-400">
              {description}
            </DialogDescription>
          )}
        </DialogHeader>
        <DialogFooter className="mx-0 mt-1 mb-0 flex-row gap-2 border-0 bg-transparent p-0">
          <DialogClose asChild>
            <Button
              type="button"
              variant="outline"
              className="h-8 flex-1 rounded-sm text-xs font-normal"
            >
              취소
            </Button>
          </DialogClose>
          <Button
            type="button"
            onClick={onConfirm}
            className="h-8 flex-1 rounded-sm bg-gitlog-danger text-xs font-normal text-white hover:bg-gitlog-danger/90"
          >
            {confirmLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
