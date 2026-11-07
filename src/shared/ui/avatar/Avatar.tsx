/** Avatar에서 지원하는 세 가지 디자인 크기입니다. */
export type AvatarSize = 'small' | 'medium' | 'large';

export type AvatarProps = {
  /** `small` 40px, `medium` 64px, `large` 90px로 표시합니다. */
  size: AvatarSize;
  /** 표시할 프로필 이미지 URL입니다. 생략하면 기본 G 로고를 표시합니다. */
  src?: string;
  /** 프로필 이미지의 대체 텍스트입니다. */
  alt?: string;
  /** 화면 위쪽의 주요 이미지는 `eager`, 반복 목록 이미지는 `lazy`로 설정합니다. */
  loading?: 'eager' | 'lazy';
};

const avatarStyles: Record<AvatarSize, { size: number; fontSize: number; logoOffsetX: number }> = {
  small: { size: 40, fontSize: 16, logoOffsetX: -2 },
  medium: { size: 64, fontSize: 36, logoOffsetX: -5 },
  large: { size: 90, fontSize: 50, logoOffsetX: -5 },
};

/** 프로필 이미지를 표시하고 이미지가 없으면 기본 G 로고를 표시합니다. */
export function Avatar({ size, src, alt = '프로필 사진', loading = 'eager' }: AvatarProps) {
  const style = avatarStyles[size];

  return (
    <div
      className="flex items-center justify-center overflow-hidden rounded-full bg-black"
      style={{ width: style.size, height: style.size }}
    >
      {src ? (
        <img
          src={toSecureImageUrl(src)}
          alt={alt}
          width={style.size}
          height={style.size}
          loading={loading}
          decoding="async"
          className="h-full w-full object-cover"
        />
      ) : (
        <span
          aria-hidden="true"
          className="flex items-center justify-center text-white [font-family:var(--font-smooch)]"
          style={{
            fontSize: style.fontSize,
            transform: `translateX(${style.logoOffsetX}px)`,
          }}
        >
          G
        </span>
      )}
    </div>
  );
}
import { toSecureImageUrl } from '@/shared/utils/image';
