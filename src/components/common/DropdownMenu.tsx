import { MoreVertical } from 'lucide-react';
import { useId, useRef, useState } from 'react';
import { useEscapeKey } from '@/hooks/useEscapeKey';
import { useOutsideClick } from '@/hooks/useOutsideClick';
import { cn } from '@/utils/cn';
import IconButton from './IconButton';

export interface DropdownMenuItem {
  label: string;
  onSelect: () => void;
  isDanger?: boolean;
}

interface DropdownMenuProps {
  /** 버튼을 스크린 리더가 읽을 이름 (예: 게시물 메뉴) */
  label: string;
  items: DropdownMenuItem[];
}

/** 점 세 개(케밥) 버튼을 누르면 수정/삭제 같은 메뉴가 열린다. */
function DropdownMenu({ label, items }: DropdownMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const menuId = useId();

  const closeMenu = () => setIsOpen(false);
  useEscapeKey(closeMenu, isOpen);
  useOutsideClick(containerRef, closeMenu, isOpen);

  return (
    <div ref={containerRef} className="relative">
      <IconButton
        aria-label={label}
        aria-haspopup="menu"
        aria-expanded={isOpen}
        aria-controls={menuId}
        onClick={() => setIsOpen((prev) => !prev)}
      >
        <MoreVertical size={18} aria-hidden />
      </IconButton>

      {isOpen && (
        <ul
          id={menuId}
          role="menu"
          className="absolute top-full right-0 z-20 mt-1 w-28 animate-fade-in rounded-sm bg-white py-1 shadow-[0_2px_10px_rgba(0,0,0,0.12)]"
        >
          {items.map(({ label: itemLabel, onSelect, isDanger }) => (
            <li key={itemLabel} role="none">
              <button
                type="button"
                role="menuitem"
                onClick={() => {
                  closeMenu();
                  onSelect();
                }}
                className={cn(
                  'w-full px-3 py-2 text-left text-sm hover:bg-gray-50 focus-visible:bg-gray-50 focus-visible:outline-none',
                  isDanger ? 'text-danger' : 'text-ink',
                )}
              >
                {itemLabel}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default DropdownMenu;
