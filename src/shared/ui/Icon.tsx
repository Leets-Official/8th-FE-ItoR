import add_photo_alternate from '@/shared/assets/icons/add_photo_alternate.svg';
import chat from '@/shared/assets/icons/chat.svg';
import clear from '@/shared/assets/icons/clear.svg';
import create from '@/shared/assets/icons/create.svg';
import delete_forever from '@/shared/assets/icons/delete_forever.svg';
import done from '@/shared/assets/icons/done.svg';
import error_outline from '@/shared/assets/icons/error_outline.svg';
import folder_open from '@/shared/assets/icons/folder_open.svg';
import kakao from '@/shared/assets/icons/kakao.svg';
import more_vert from '@/shared/assets/icons/more_vert.svg';
import navigate_before from '@/shared/assets/icons/navigate_before.svg';
import pagination_left from '@/shared/assets/icons/pagination_left.svg';
import pagination_right from '@/shared/assets/icons/pagination_right.svg';
import reorder from '@/shared/assets/icons/reorder.svg';
import settings from '@/shared/assets/icons/settings.svg';
import { cn } from '@/shared/lib/utils';

const ICONS = {
  add_photo_alternate,
  chat,
  clear,
  create,
  delete_forever,
  done,
  error_outline,
  folder_open,
  kakao,
  more_vert,
  navigate_before,
  pagination_left,
  pagination_right,
  reorder,
  settings,
};

export type IconName = keyof typeof ICONS;
export type IconSize = 40 | 24 | 14 | 12;

const BOX_CLASS: Record<IconSize, string> = {
  40: 'size-10',
  24: 'size-6',
  14: 'size-3.5',
  12: 'size-3',
};

// 40 사이즈는 24px 아이콘에 여백만 추가된 영역이라 글리프는 24px 그대로 유지
const GLYPH_CLASS: Record<IconSize, string> = {
  40: 'size-6',
  24: 'size-6',
  14: 'size-3.5',
  12: 'size-3',
};

interface IconProps {
  name: IconName;
  size?: IconSize;
  className?: string;
}

// svg를 mask로 써서 부모의 글자색(currentColor)으로 아이콘을 칠한다
export function Icon({ name, size = 24, className }: IconProps) {
  return (
    <span
      aria-hidden
      className={cn('inline-flex shrink-0 items-center justify-center', BOX_CLASS[size], className)}
    >
      <span
        className={cn('bg-current mask-contain mask-center mask-no-repeat', GLYPH_CLASS[size])}
        style={{ maskImage: `url("${ICONS[name]}")` }}
      />
    </span>
  );
}
