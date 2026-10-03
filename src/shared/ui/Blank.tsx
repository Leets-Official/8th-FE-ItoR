import { cn } from '@/shared/lib/utils';
export type BlankSize = 64 | 32 | 20;

const SIZE_CLASS: Record<BlankSize, string> = {
  64: 'h-16',
  32: 'h-8',
  20: 'h-5',
};

interface BlankProps {
  size: BlankSize;
  className?: string;
}

export function Blank({ size, className }: BlankProps) {
  return (
    <div aria-hidden className={cn('w-full max-w-[688px] bg-white', SIZE_CLASS[size], className)} />
  );
}
