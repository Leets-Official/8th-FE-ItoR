export type DropDownMenuItem = {
  /** 메뉴에 표시할 문구입니다. */
  text: string;
  /** 삭제처럼 주의가 필요한 항목은 `negative`를 사용합니다. */
  variant?: 'default' | 'negative';
  /** 항목을 선택했을 때 실행할 동작입니다. */
  onClick?: () => void;
};

function DropDownItem({ text, variant = 'default', onClick }: DropDownMenuItem) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex h-fit w-40 gap-2.5 bg-white px-3 pb-3 pt-2 text-left active:bg-gray-90"
    >
      <span
        className={`text-14-regular ${variant === 'negative' ? 'text-negative' : 'text-black'}`}
      >
        {text}
      </span>
    </button>
  );
}

export type DropDownMenuProps = {
  /** 위에서 아래 순서로 표시할 메뉴 항목입니다. */
  items: readonly DropDownMenuItem[];
};

/** 기준 버튼 아래에 화살표와 메뉴 항목을 표시하는 드롭다운입니다. */
export function DropDownMenu({ items }: DropDownMenuProps) {
  return (
    <div className="flex h-fit w-fit flex-col drop-shadow-[0_2px_8px_rgba(0,0,0,0.1)]">
      <div className="h-2 w-[29px] self-end">
        <div className="ml-[7px] h-2 w-4 bg-white [clip-path:polygon(50%_0,100%_100%,0_100%)]" />
      </div>
      <div className="flex h-fit w-40 flex-col rounded-[4px] bg-white py-1">
        {items.map((item) => (
          <DropDownItem key={item.text} {...item} />
        ))}
      </div>
    </div>
  );
}
