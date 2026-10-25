import { useEffect, useRef, type KeyboardEvent } from 'react';

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
      role="menuitem"
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
  /** 메뉴와 메뉴를 여는 버튼을 연결하는 id입니다. */
  id?: string;
  /** Escape 키로 메뉴를 닫을 때 실행합니다. */
  onClose?: () => void;
};

/** 기준 버튼 아래에 화살표와 메뉴 항목을 표시하는 드롭다운입니다. */
export function DropDownMenu({ items, id, onClose }: DropDownMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const triggerElement = document.activeElement as HTMLElement | null;
    menuRef.current?.querySelector<HTMLButtonElement>('[role="menuitem"]')?.focus();

    return () => triggerElement?.focus();
  }, []);

  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    const menuItems = Array.from(
      menuRef.current?.querySelectorAll<HTMLButtonElement>('[role="menuitem"]') ?? [],
    );
    if (menuItems.length === 0) {
      return;
    }

    const currentIndex = menuItems.indexOf(document.activeElement as HTMLButtonElement);
    let nextIndex: number;

    if (event.key === 'Escape') {
      event.preventDefault();
      onClose?.();
      return;
    }

    if (event.key === 'ArrowDown') {
      nextIndex = (currentIndex + 1) % menuItems.length;
    } else if (event.key === 'ArrowUp') {
      nextIndex = (currentIndex - 1 + menuItems.length) % menuItems.length;
    } else if (event.key === 'Home') {
      nextIndex = 0;
    } else if (event.key === 'End') {
      nextIndex = menuItems.length - 1;
    } else {
      return;
    }

    event.preventDefault();
    menuItems[nextIndex]?.focus();
  }

  return (
    <div
      ref={menuRef}
      id={id}
      role="menu"
      className="flex h-fit w-fit flex-col drop-shadow-[0_2px_8px_rgba(0,0,0,0.1)]"
      onKeyDown={handleKeyDown}
    >
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
