/** TextField에서 지원하는 입력 글자 크기입니다. */
export type TextFieldVariant = '24' | '14';
/** TextField에서 지원하는 HTML 입력 형식입니다. */
export type TextFieldInputType = 'text' | 'email' | 'password';

export type TextFieldProps = {
  /** `24`는 제목형 입력, `14`는 일반 입력에 사용합니다. */
  variant: TextFieldVariant;
  /** 브라우저에 전달할 입력 데이터 형식입니다. */
  inputType?: TextFieldInputType;
  /** 값이 없을 때 표시할 문구이며 기본 접근성 이름으로도 사용합니다. */
  placeholder: string;
  /** 제어 입력으로 사용할 현재 값입니다. */
  value?: string;
  /** 입력을 비활성화하고 비활성화 스타일을 적용합니다. */
  disabled?: boolean;
  /** 값 선택은 허용하면서 수정을 막습니다. */
  readOnly?: boolean;
  /** 입력창 배경색입니다. 생략하면 투명 배경을 사용합니다. */
  backgroundColor?: string;
  /** placeholder와 다른 접근성 이름이 필요할 때 사용합니다. */
  ariaLabel?: string;
  /** 변경된 문자열 값을 전달받습니다. */
  onChange?: (value: string) => void;
};

const textStyles = {
  '24': 'text-24-medium',
  '14': 'text-14-light',
};

/** 제목형과 일반형 글자 크기를 지원하는 한 줄 입력창입니다. */
export function TextField({
  variant,
  inputType = 'text',
  placeholder,
  value,
  disabled = false,
  readOnly = false,
  backgroundColor,
  ariaLabel,
  onChange,
}: TextFieldProps) {
  return (
    <input
      type={inputType}
      aria-label={ariaLabel ?? placeholder}
      className={`h-fit w-[656px] max-w-full rounded-[4px] border border-gray-90 bg-transparent px-4 py-3 text-black transition-colors duration-100 ease-out placeholder:text-gray-56 focus:border-gray-33 focus:outline-none disabled:bg-gray-90 disabled:text-gray-56 ${textStyles[variant]}`}
      placeholder={placeholder}
      value={value}
      disabled={disabled}
      readOnly={readOnly}
      style={disabled ? undefined : { backgroundColor }}
      onChange={(event) => onChange?.(event.target.value)}
    />
  );
}
