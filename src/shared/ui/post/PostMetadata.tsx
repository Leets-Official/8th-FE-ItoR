export type PostMetadataProps = {
  /** 작성자 이름입니다. */
  nickname: string;
  /** 화면에 표시할 형식으로 변환된 작성일입니다. */
  createdAt: string;
  /** 게시글의 댓글 수입니다. */
  commentCount: number;
  /** 작성자 프로필 이미지 URL입니다. 생략하면 기본 원형을 표시합니다. */
  profileImageUrl?: string;
};

function MetadataDivider() {
  return (
    <span aria-hidden="true" className="flex h-5 w-3 items-center justify-center">
      <span className="h-0.5 w-0.5 rounded-full bg-gray-90" />
    </span>
  );
}

/** 게시글 작성자의 프로필, 닉네임, 작성일과 댓글 수를 한 줄로 표시합니다. */
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
