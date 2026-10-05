import { TextField, type TextFieldInputType, type TextFieldVariant } from './TextField';

export type FormFieldProps = {
  /** 입력창 위에 표시할 선택 레이블입니다. */
  title?: string;
  /** 입력 글자 크기입니다. 기본값은 `14`입니다. */
  variant?: TextFieldVariant;
  /** 브라우저에 전달할 입력 데이터 형식입니다. */
  inputType?: TextFieldInputType;
  /** 값이 없을 때 입력창에 표시할 문구입니다. */
  textPlaceholder: string;
  /** 오류가 없을 때 입력창 아래에 항상 표시할 안내 문구입니다. */
  helperText?: string;
  /** `showWarning`이 true일 때 안내 문구 대신 표시할 오류 문구입니다. */
  warningMessage?: string;
  /** 검증 오류 스타일과 `warningMessage`를 표시할지 정합니다. */
  showWarning?: boolean;
  /** 제어 입력으로 사용할 현재 값입니다. */
  value?: string;
  /** 입력을 비활성화하고 비활성화 스타일을 적용합니다. */
  disabled?: boolean;
  /** 값 선택은 허용하면서 수정을 막습니다. */
  readOnly?: boolean;
  /** 입력창 배경색입니다. 생략하면 투명 배경을 사용합니다. */
  backgroundColor?: string;
  /** 변경된 문자열 값을 전달받습니다. */
  onChange?: (value: string) => void;
};

/** 레이블, 입력창, 안내 또는 검증 문구를 한 묶음으로 표시하는 폼 필드입니다. */
export function FormField({
  title,
  variant = '14',
  inputType = 'text',
  textPlaceholder,
  helperText,
  warningMessage,
  showWarning = false,
  value,
  disabled = false,
  readOnly = false,
  backgroundColor,
  onChange,
}: FormFieldProps) {
  return (
    <div className="flex h-fit w-[688px] max-w-full flex-col gap-1 bg-transparent px-4 py-3">
      <label className="flex w-full flex-col gap-3">
        {title ? <span className="text-14-light px-[6px] text-gray-56">{title}</span> : null}
        <TextField
          variant={variant}
          inputType={inputType}
          placeholder={textPlaceholder}
          value={value}
          disabled={disabled}
          readOnly={readOnly}
          backgroundColor={backgroundColor}
          onChange={onChange}
        />
      </label>

      {showWarning && warningMessage ? (
        <p role="alert" className="text-12-light px-[6px] text-negative">
          {warningMessage}
        </p>
      ) : helperText ? (
        <p className="text-12-light px-[6px] text-gray-78">{helperText}</p>
      ) : null}
    </div>
  );
}
