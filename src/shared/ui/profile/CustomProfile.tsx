type ProfileProps = {
  size: number;
  fontSize: number;
  logoOffsetX?: number;
};

/**
 * size: 프로필 이미지의 너비와 높이
 * fontSize: 프로필 이미지 안의 글자 크기
 * logoOffsetX: 글꼴의 시각적 중심을 맞추는 가로 보정값
 * @returns 지정한 크기의 원형 프로필 이미지
 */
function Profile({ size, fontSize, logoOffsetX = 0 }: ProfileProps) {
  return (
    <div
      className="flex items-center justify-center rounded-full bg-black"
      style={{ width: size, height: size }}
    >
      <span
        className="flex items-center justify-center text-white [font-family:var(--font-smooch)]"
        style={{
          fontSize,
          transform: `translateX(${logoOffsetX}px)`,
        }}
      >
        G
      </span>
    </div>
  );
}

/** @returns 90px 프로필 이미지 */
export function Profile_90() {
  return <Profile size={90} fontSize={50} logoOffsetX={-5} />;
}

/** @returns 64px 프로필 이미지 */
export function Profile_64() {
  return <Profile size={64} fontSize={36} logoOffsetX={-5} />;
}

/** @returns 40px 프로필 이미지 */
export function Profile_40() {
  return <Profile size={40} fontSize={16} logoOffsetX={-2} />;
}
