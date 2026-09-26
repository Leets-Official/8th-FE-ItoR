type CustomBlankProps = {
  variant: '20' | '32' | '64';
};

const heightStyles = {
  '20': 'h-5 mobile:h-[11.34px]',
  '32': 'h-8 mobile:h-[18.14px]',
  '64': 'h-16 mobile:h-[36.28px]',
};

/**
 * variant: 20px, 32px, 64px 중 사용할 여백 높이
 * @returns 부모의 배경색이 보이는 콘텐츠 사이의 여백
 */
export function CustomBlank({ variant }: CustomBlankProps) {
  return (
    <div aria-hidden="true" className={`w-[688px] max-w-full shrink-0 ${heightStyles[variant]}`} />
  );
}
