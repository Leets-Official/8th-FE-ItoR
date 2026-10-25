/** Avatar에서 지원하는 세 가지 디자인 크기입니다. */
export type AvatarSize = 'small' | 'medium' | 'large';

export type AvatarProps = {
  /** `small` 40px, `medium` 64px, `large` 90px로 표시합니다. */
  size: AvatarSize;
};

const avatarStyles: Record<AvatarSize, { size: number; fontSize: number; logoOffsetX: number }> = {
  small: { size: 40, fontSize: 16, logoOffsetX: -2 },
  medium: { size: 64, fontSize: 36, logoOffsetX: -5 },
  large: { size: 90, fontSize: 50, logoOffsetX: -5 },
};

/** 프로필 이미지가 없을 때 사용하는 G 로고 아바타입니다. */
export function Avatar({ size }: AvatarProps) {
  const style = avatarStyles[size];

  return (
    <div
      className="flex items-center justify-center rounded-full bg-black"
      style={{ width: style.size, height: style.size }}
    >
      <span
        className="flex items-center justify-center text-white [font-family:var(--font-smooch)]"
        style={{
          fontSize: style.fontSize,
          transform: `translateX(${style.logoOffsetX}px)`,
        }}
      >
        G
      </span>
    </div>
  );
}
