import { PostMetadata } from '@/shared/ui/post/PostMetadata';
import { TextContent } from '@/shared/ui/text/TextContent';

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
};

function PostThumbnail() {
  return (
    <div className="flex h-[116px] w-[124px] shrink-0 items-center justify-center px-4 py-3">
      <div className="h-[92px] w-[92px] rounded-[2px] bg-black" />
    </div>
  );
}

/** 게시글 제목, 요약, 작성 정보와 썸네일을 한 행으로 표시하는 목록 항목입니다. */
export function PostListItem({
  title,
  subtitle,
  nickname,
  createdAt,
  commentCount,
}: PostListItemProps) {
  return (
    <article className="flex w-full max-w-[688px] items-center gap-4 border-b border-b-gray-96 bg-white py-2">
      <div className="flex min-w-0 flex-1 flex-col">
        <TextContent variant="16" title={title} subtitle={subtitle} />
        <PostMetadata nickname={nickname} createdAt={createdAt} commentCount={commentCount} />
      </div>

      <PostThumbnail />
    </article>
  );
}
