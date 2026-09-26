type ProfileProps = {
  size: number;
  fontSize: number;
};

/**
 * size: 프로필 이미지의 너비와 높이
 * fontSize: 프로필 이미지 안의 글자 크기
 * @returns 지정한 크기의 원형 프로필 이미지
 */
function Profile({ size, fontSize }: ProfileProps) {
  return (
    <div
      className="flex items-center justify-center rounded-full bg-black"
      style={{ width: size, height: size }}
    >
      <span
        className="text-white [font-family:var(--font-smooch)]"
        style={{ fontSize, lineHeight: 1 }}
      >
        G
      </span>
    </div>
  );
}

/** @returns 90px 프로필 이미지 */
export function Profile_90() {
  return <Profile size={90} fontSize={50} />;
}

/** @returns 64px 프로필 이미지 */
export function Profile_64() {
  return <Profile size={64} fontSize={36} />;
}

/** @returns 40px 프로필 이미지 */
export function Profile_40() {
  return <Profile size={40} fontSize={16} />;
}
