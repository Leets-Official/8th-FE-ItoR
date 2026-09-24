import type { ComponentType, SVGProps } from 'react';

export type IconSource = ComponentType<SVGProps<SVGSVGElement>>;
export type IconSize = 'icon-14' | 'icon-24' | 'icon-40';

type IconProps = {
  source: IconSource;
  size: IconSize;
  color?: string;
};

/**
 * source: 표시할 SVG 아이콘
 * size: 전역 아이콘 크기
 * color: 아이콘에 적용할 색상
 * @returns 지정한 크기와 색상이 적용된 SVG 아이콘
 */
export const Icon = ({ source: SvgIcon, size, color }: IconProps) => {
  return <SvgIcon style={{ width: `var(--${size})`, height: `var(--${size})`, color }} />;
};
