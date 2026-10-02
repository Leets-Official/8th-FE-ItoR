export type CustomTextFilledVariant = '24' | '14';

type CustomTextFilledProps = {
  variant: CustomTextFilledVariant;
  placeholder: string;
  value?: string;
  disabled?: boolean;
  ariaLabel?: string;
  onChange?: (value: string) => void;
};

const textStyles = {
  '24': 'text-24-medium',
  '14': 'text-14-light',
};

/**
 * variant: 입력 글자 스타일
 * placeholder: 입력창 placeholder
 * value: 입력값
 * disabled: 입력 비활성화 여부
 * ariaLabel: 입력창 접근성 이름
 * onChange: 입력값 변경 함수
 * @returns 입력 상태가 자동으로 표현되는 입력창
 */
export function CustomTextFilled({
  variant,
  placeholder,
  value,
  disabled = false,
  ariaLabel,
  onChange,
}: CustomTextFilledProps) {
  return (
    <input
      type="text"
      aria-label={ariaLabel ?? placeholder}
      className={`h-fit w-[656px] max-w-full rounded-l border border-gray-90 px-4 py-3 text-black transition-colors duration-100 ease-out placeholder:text-gray-56 focus:border-gray-33 focus:outline-none disabled:bg-gray-90 disabled:text-gray-56 ${textStyles[variant]}`}
      placeholder={placeholder}
      value={value}
      disabled={disabled}
      onChange={(event) => onChange?.(event.target.value)}
    />
  );
}
