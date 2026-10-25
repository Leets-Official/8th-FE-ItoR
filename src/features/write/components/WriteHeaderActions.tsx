type WriteHeaderActionsProps = {
  formId?: string;
};

export function WriteHeaderActions({ formId }: WriteHeaderActionsProps) {
  return (
    <div className="flex items-center gap-2.5">
      <button
        type="button"
        className="flex h-fit w-[76px] items-center gap-1 rounded-[25px] px-3 py-2"
      >
        <span className="text-14-regular text-negative">삭제하기</span>
      </button>
      <button
        type="submit"
        form={formId}
        className="flex h-fit w-[76px] items-center gap-1 rounded-[25px] px-3 py-2"
      >
        <span className="text-14-regular text-black">게시하기</span>
      </button>
    </div>
  );
}
