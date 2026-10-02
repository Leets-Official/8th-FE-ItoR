type PostMetadataProps = {
  nickname: string;
  createdAt: string;
  commentCount: number;
  profileImageUrl?: string;
};

/** @returns 작성 정보 사이에 표시하는 장식용 구분점 */
function MetadataDivider() {
  return (
    <span aria-hidden="true" className="flex h-5 w-3 items-center justify-center">
      <span className="h-0.5 w-0.5 rounded-full bg-gray-90" />
    </span>
  );
}

/** @returns 작성자의 프로필, 닉네임, 작성일과 댓글 수를 표시하는 공통 UI */
export function PostMetadata({
  nickname,
  createdAt,
  commentCount,
  profileImageUrl,
}: PostMetadataProps) {
  return (
    <div className="flex w-fit items-center px-4 py-3">
      <div className="flex items-center gap-1.5">
        {profileImageUrl ? (
          <img
            alt=""
            aria-hidden="true"
            className="h-5 w-5 rounded-full object-cover"
            src={profileImageUrl}
          />
        ) : (
          <span aria-hidden="true" className="h-5 w-5 rounded-full bg-black" />
        )}
        <span className="text-12-regular text-gray-20">{nickname}</span>
      </div>

      <MetadataDivider />
      <span className="text-12-light text-gray-56">{createdAt}</span>
      <MetadataDivider />
      <span className="text-12-light text-gray-56">댓글{commentCount}</span>
    </div>
  );
}
