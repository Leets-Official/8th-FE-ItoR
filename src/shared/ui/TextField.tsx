import { useId, type ComponentProps } from 'react';

import { cn } from '@/shared/utils/cn';

interface TextFieldProps extends Omit<ComponentProps<'input'>, 'size'> {
  label?: string;
  hint?: string;
  size?: 'sm' | 'md';
}

export function TextField({
  label,
  hint,
  size = 'md',
  id,
  className,
  disabled,
  ...props
}: TextFieldProps) {
  const generatedId = useId();
  const inputId = id ?? props.name ?? generatedId;
  const hintId = hint && inputId ? `${inputId}-hint` : undefined;

  return (
    <div className="w-full">
      {label && (
        <label htmlFor={inputId} className="mb-2 block text-sm text-neutral-500">
          {label}
        </label>
      )}
      <input
        {...props}
        id={inputId}
        disabled={disabled}
        aria-describedby={hintId}
        className={cn(
          'w-full border border-transparent bg-white/20 text-neutral-950 placeholder:text-neutral-400 focus-visible:border-neutral-500 focus-visible:outline-none disabled:cursor-not-allowed disabled:bg-neutral-200 disabled:text-neutral-400 aria-invalid:border-gitlog-danger',
          size === 'md' ? 'h-12 px-3 text-base' : 'h-9 px-3 text-xs',
          className,
        )}
      />
      {hint && (
        <p id={hintId} className="mt-1 text-xs text-neutral-400">
          {hint}
        </p>
      )}
    </div>
  );
}
