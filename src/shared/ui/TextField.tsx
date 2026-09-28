import { useId, type ComponentProps, type ReactNode } from 'react';
import { cn } from '@/shared/lib/utils';

// Figma font=32 / font=14 변형 — "32 medium" 스타일의 실제 글자 크기는 24px
export type TextFieldSize = 32 | 14;

const SIZE_CLASS: Record<TextFieldSize, string> = {
  32: 'h-[62px] text-24 font-medium',
  14: 'h-[46px] text-14 font-light',
};

const PLACEHOLDER_COLOR_CLASS: Record<TextFieldSize, string> = {
  32: 'placeholder:text-gray-56',
  14: 'placeholder:text-gray-78',
};

interface TextFieldProps extends Omit<ComponentProps<'input'>, 'size'> {
  size?: TextFieldSize;
}

// Figma 상태 defalt / input / click / Disabled = placeholder 표시 / 값 입력 / focus / disabled
export function TextField({ size = 14, disabled = false, className, ...props }: TextFieldProps) {
  return (
    <input
      disabled={disabled}
      className={cn(
        'w-full rounded-sm border px-4 outline-none',
        SIZE_CLASS[size],
        disabled
          ? 'border-gray-90 bg-gray-90 text-gray-56 placeholder:text-gray-56'
          : ['border-gray-90 text-black focus:border-gray-33', PLACEHOLDER_COLOR_CLASS[size]],
        className,
      )}
      {...props}
    />
  );
}

interface TextFieldSetProps extends TextFieldProps {
  label: ReactNode;
  caution?: ReactNode;
}

// 라벨(제목) + 입력창 + 주의 문구. className은 바깥 영역에, 나머지 props는 입력창에 전달된다
export function TextFieldSet({ label, caution, id, className, ...props }: TextFieldSetProps) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const cautionId = useId();

  return (
    <div className={cn('flex flex-col gap-1 px-4 py-3', className)}>
      <div className="flex flex-col gap-3">
        <label htmlFor={inputId} className="px-1.5 text-14 font-light text-gray-56">
          {label}
        </label>
        <TextField id={inputId} aria-describedby={caution ? cautionId : undefined} {...props} />
      </div>
      {caution && (
        <p id={cautionId} className="px-1.5 text-12 font-light text-gray-78">
          {caution}
        </p>
      )}
    </div>
  );
}
