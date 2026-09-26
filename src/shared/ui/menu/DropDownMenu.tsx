type DropDownMaterialProps = {
  text: string;
};

/**
 * text: 드롭다운 항목에 표시할 이름
 * @returns 누르는 동안 배경색이 바뀌는 드롭다운 항목
 */
function DropDownMaterial({ text }: DropDownMaterialProps) {
  return (
    <button
      type="button"
      className="flex h-fit w-40 gap-2.5 bg-white px-3 pb-3 pt-2 text-left active:bg-gray-90"
    >
      <span className="text-14-regular text-black">{text}</span>
    </button>
  );
}

type DropDownMenuProps = {
  items: string[];
};

/**
 * items: 드롭다운에 표시할 메뉴 이름 목록
 * @returns 전달받은 메뉴 항목을 표시하는 드롭다운
 */
export function DropDownMenu({ items }: DropDownMenuProps) {
  return (
    <div className="flex h-fit w-fit flex-col drop-shadow-[0_2px_8px_rgba(0,0,0,0.1)]">
      <div className="h-2 w-[29px] self-end">
        <div className="ml-[7px] h-2 w-4 bg-white [clip-path:polygon(50%_0,100%_100%,0_100%)]" />
      </div>
      <div className="flex h-fit w-40 flex-col rounded-[4px] bg-white py-1">
        {items.map((item) => (
          <DropDownMaterial text={item} />
        ))}
      </div>
    </div>
  );
}
