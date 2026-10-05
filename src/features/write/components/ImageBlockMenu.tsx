import { DeleteForeverIcon } from '@/shared/assets/icons/icons';
import { Icon } from '@/shared/assets/icons/Icon';

export function ImageBlockMenu() {
  return (
    <div className="flex h-fit w-fit flex-col drop-shadow-[0_2px_8px_rgba(0,0,0,0.1)]">
      <div className="flex h-fit w-fit items-center justify-center gap-2.5 rounded-l bg-white px-4 py-1">
        <div className="flex h-10 w-10 items-center justify-center">
          <Icon source={DeleteForeverIcon} size="icon-24" />
        </div>
      </div>
      <div className="h-2 w-4 self-center bg-white [clip-path:polygon(0_0,100%_0,50%_100%)]" />
    </div>
  );
}
