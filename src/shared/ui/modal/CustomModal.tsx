type ModalButtonProps = {
  variant: 'cancel' | 'danger';
  text: string;
  onClick?: () => void;
};

const modalButtonStyles = {
  cancel: 'bg-white text-black',
  danger: 'bg-negative text-white',
};

// TODO: 동일한 스타일의 공통 버튼이 추가되면 재사용할 수 있는지 확인합니다.
/**
 * variant: 버튼의 색상 유형
 * text: 버튼에 표시할 텍스트
 * onClick: 버튼 클릭 시 실행할 함수
 * @returns 선택한 유형의 모달 동작 버튼
 */
const ModalButton = ({ variant, text, onClick }: ModalButtonProps) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`text-14-regular flex h-fit w-full items-center justify-center gap-2 rounded-[2px] border border-gray-96 px-3 py-2 ${modalButtonStyles[variant]}`}
    >
      {text}
    </button>
  );
};

type CustomModalProps = {
  title: string;
  description?: string;
};

/**
 * title: 모달에 표시할 제목
 * description: 제목 아래에 선택적으로 표시할 설명이며 없으면 표시되지 않습니다.
 * @returns 제목·설명·동작 버튼을 표시하는 모달
 */
export const CustomModal = ({ title, description }: CustomModalProps) => {
  return (
    <div className="flex h-fit w-[326px] flex-col gap-6 rounded-[4px] bg-white px-4 pb-4 pt-6 shadow-[0_2px_8px_rgba(0,0,0,0.1)]">
      <div className="flex h-fit w-full flex-col gap-2 rounded-xl px-1">
        <span className="text-14-regular line-clamp-2 w-full text-black">{title}</span>
        {description && (
          <span className="text-12-regular line-clamp-2 w-full text-gray-56">{description}</span>
        )}
      </div>

      <div className="flex h-fit w-full items-center justify-center gap-3">
        <ModalButton variant="cancel" text="취소" />
        <ModalButton variant="danger" text="삭제하기" />
      </div>
    </div>
  );
};
