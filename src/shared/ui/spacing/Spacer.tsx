export type SpacerProps = {
  /** 데스크톱에서 사용할 세로 여백 높이(px)입니다. */
  variant: '20' | '32' | '64';
};

const heightStyles = {
  '20': 'h-5 mobile:h-[11.34px]',
  '32': 'h-8 mobile:h-[18.14px]',
  '64': 'h-16 mobile:h-[36.28px]',
};

/** 부모 배경을 그대로 보이며 모바일에서는 비율에 맞춰 줄어드는 세로 여백입니다. */
export function Spacer({ variant }: SpacerProps) {
  return (
    <div aria-hidden="true" className={`w-[688px] max-w-full shrink-0 ${heightStyles[variant]}`} />
  );
}
