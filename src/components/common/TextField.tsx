import { useId, type InputHTMLAttributes, type ReactNode } from 'react';
import { cn } from '@/utils/cn';

interface TextFieldProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label?: string;
  /** 입력칸 아래에 보여줄 안내 문구 (예: * 20글자 이내) */
  helperText?: string;
  errorMessage?: string;
  size?: 'md' | 'lg';
  leftIcon?: ReactNode;
}

function TextField({
  label,
  helperText,
  errorMessage,
  size = 'md',
  leftIcon,
  id,
  className,
  ...rest
}: TextFieldProps) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const descriptionId = `${inputId}-description`;
  const description = errorMessage ?? helperText;

  return (
    <div className={cn('flex flex-col gap-2', className)}>
      {label && (
        <label htmlFor={inputId} className="px-1 text-sm text-gray-500">
          {label}
        </label>
      )}
      <div className="relative">
        {leftIcon && (
          <span className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-ink">
            {leftIcon}
          </span>
        )}
        <input
          id={inputId}
          aria-invalid={Boolean(errorMessage)}
          aria-describedby={description ? descriptionId : undefined}
          className={cn(
            'w-full rounded-sm border bg-white px-3 text-ink transition-colors outline-none placeholder:text-gray-400',
            'focus:border-gray-700 disabled:border-gray-200 disabled:bg-gray-200 disabled:text-gray-500',
            size === 'md' ? 'h-10 text-sm' : 'h-12 text-xl font-medium',
            errorMessage ? 'border-danger' : 'border-gray-100',
            Boolean(leftIcon) && 'pl-9',
          )}
          {...rest}
        />
      </div>
      {description && (
        <p
          id={descriptionId}
          className={cn('px-1 text-xs', errorMessage ? 'text-danger' : 'text-gray-400')}
        >
          * {description}
        </p>
      )}
    </div>
  );
}

export default TextField;
