import { CustomTextFilled } from './CustomTextFilled';

type CustomTextFilledSetProps = {
  title: string;
  textPlaceholder: string;
  warningMessage: string;
  showWarning?: boolean;
  value?: string;
  disabled?: boolean;
  onChange?: (value: string) => void;
};

/**
 * title: 입력 항목 제목
 * textPlaceholder: 입력창 placeholder
 * warningMessage: 검증 실패 시 표시할 문구
 * showWarning: 주의 문구 표시 여부
 * value: 입력값
 * disabled: 입력 비활성화 여부
 * onChange: 입력값 변경 함수
 * @returns 제목, 입력창, 주의 문구로 구성된 입력 세트
 */
export function CustomTextFilledSet({
  title,
  textPlaceholder,
  warningMessage,
  showWarning = false,
  value,
  disabled = false,
  onChange,
}: CustomTextFilledSetProps) {
  return (
    <div className="flex h-fit w-[688px] max-w-full flex-col gap-1 px-4 py-3">
      <label className="flex w-full flex-col gap-3">
        <span className="text-14-light px-[6px] text-gray-56">{title}</span>
        <CustomTextFilled
          variant="14"
          placeholder={textPlaceholder}
          value={value}
          disabled={disabled}
          onChange={onChange}
        />
      </label>

      {showWarning && (
        <p role="alert" className="text-12-light px-[6px] text-negative">
          {warningMessage}
        </p>
      )}
    </div>
  );
}
