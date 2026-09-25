type CustomBlankProps = {
  variant: '20' | '32' | '64';
};

const heightStyles = {
  '20': 'h-5',
  '32': 'h-8',
  '64': 'h-16',
};

/**
 * variant: 20px, 32px, 64px 중 사용할 여백 높이
 * @returns 콘텐츠 사이의 흰색 여백
 */
export const CustomBlank = ({ variant }: CustomBlankProps) => {
  return (
    <div
      aria-hidden="true"
      className={`w-[688px] max-w-full shrink-0 bg-white ${heightStyles[variant]}`}
    />
  );
};
