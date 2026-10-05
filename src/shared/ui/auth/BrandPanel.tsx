import type { ComponentType, SVGProps } from 'react';

export type BrandPanelProps = {
  /** 패널 상단에 표시할 SVG 로고 컴포넌트입니다. */
  logo: ComponentType<SVGProps<SVGSVGElement>>;
};

/** 인증 화면에서 로고와 브랜드 문구를 같은 배치로 표시합니다. */
export function BrandPanel({ logo: BrandLogo }: BrandPanelProps) {
  return (
    <div className="flex h-fit w-full min-w-[240px] flex-col items-center justify-center">
      <div className="flex h-[160px] w-[344px] min-w-[240px] max-w-[344px] items-center justify-center">
        <div className="flex h-[160px] w-[308px] items-center justify-center">
          <BrandLogo aria-hidden="true" />
        </div>
      </div>

      <div className="flex h-[46px] w-full min-w-[240px] max-w-[344px] items-center justify-center gap-2.5 px-4 py-3">
        <span className="text-14-light text-gray-56">You can make anything by writing</span>
      </div>
    </div>
  );
}
