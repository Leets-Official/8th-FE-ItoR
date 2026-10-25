import { useProfileEditMode } from '../hooks/useProfileEditMode';

type ProfileEditHeaderActionsProps = {
  formId?: string;
};

export function ProfileEditHeaderActions({ formId }: ProfileEditHeaderActionsProps) {
  const { isEditing, startEditing, stopEditing } = useProfileEditMode();

  if (!isEditing) {
    return (
      <button
        type="button"
        onClick={startEditing}
        className="flex h-fit w-fit items-center rounded-[25px] px-3 py-2"
      >
        <span className="text-14-regular text-black">수정하기</span>
      </button>
    );
  }

  return (
    <div className="flex items-center gap-2.5">
      <button
        type="reset"
        form={formId}
        onClick={stopEditing}
        className="flex h-fit w-fit items-center rounded-[25px] px-3 py-2"
      >
        <span className="text-14-regular text-negative">취소하기</span>
      </button>
      <button
        type="submit"
        form={formId}
        className="flex h-fit w-fit items-center rounded-[25px] px-3 py-2"
      >
        <span className="text-14-regular text-black">저장하기</span>
      </button>
    </div>
  );
}
