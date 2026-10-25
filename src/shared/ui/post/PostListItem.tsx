import { PostMetadata } from '@/shared/ui/post/PostMetadata';
import { TextContent } from '@/shared/ui/text/TextContent';
import { toSecureImageUrl } from '@/shared/utils/image';

export type PostListItemProps = {
  /** 한 줄로 표시할 게시글 제목입니다. */
  title: string;
  /** 최대 두 줄로 표시할 게시글 요약입니다. */
  subtitle: string;
  /** 메타데이터에 표시할 작성자 이름입니다. */
  nickname: string;
  /** 화면에 표시할 형식으로 변환된 작성일입니다. */
  createdAt: string;
  /** 게시글의 댓글 수입니다. */
  commentCount: number;
  /** 작성자 프로필 이미지 URL입니다. */
  profileImageUrl?: string;
  /** 게시글의 첫 이미지로 표시할 썸네일 URL입니다. */
  thumbnailImageUrl?: string;
  /** 첫 화면에 보이는 대표 이미지만 `eager`로 설정합니다. */
  imageLoading?: 'eager' | 'lazy';
};

type PostThumbnailProps = {
  src: string;
  loading: 'eager' | 'lazy';
};

function PostThumbnail({ src, loading }: PostThumbnailProps) {
  return (
    <div className="flex h-[116px] w-[124px] shrink-0 items-center justify-center px-4 py-3">
      <img
        src={toSecureImageUrl(src)}
        alt=""
        width={92}
        height={92}
        loading={loading}
        decoding="async"
        fetchPriority={loading === 'eager' ? 'high' : 'auto'}
        className="h-[92px] w-[92px] rounded-[2px] object-cover"
      />
    </div>
  );
}

/** 게시글 제목·요약과 썸네일을 표시하고 그 아래에 작성 정보를 배치하는 목록 항목입니다. */
export function PostListItem({
  title,
  subtitle,
  nickname,
  createdAt,
  commentCount,
  profileImageUrl,
  thumbnailImageUrl,
  imageLoading = 'lazy',
}: PostListItemProps) {
  return (
    <article className="flex w-full max-w-[688px] flex-col border-b border-b-gray-96 bg-white py-2">
      <div className="flex w-full items-center gap-4">
        <div className="min-w-0 flex-1">
          <TextContent variant="16" title={title} subtitle={subtitle} />
        </div>

        {thumbnailImageUrl ? (
          <PostThumbnail src={thumbnailImageUrl} loading={imageLoading} />
        ) : null}
      </div>

      <PostMetadata
        nickname={nickname}
        createdAt={createdAt}
        commentCount={commentCount}
        profileImageUrl={profileImageUrl}
      />
    </article>
  );
}
