import { MoreVertIcon } from '@/shared/assets/icons/icons';

type CommentAuthorProps = {
  nickname: string;
  date?: string;
  showMenu?: boolean;
  onMenuClick?: () => void;
};

export function CommentAuthor({
  nickname,
  date,
  showMenu = false,
  onMenuClick,
}: CommentAuthorProps) {
  return (
    <div className="flex h-fit w-full items-center">
      <div className="flex w-full items-center gap-1.5 px-4 py-3">
        <span aria-hidden="true" className="h-5 w-5 rounded-full bg-black" />

        {date ? (
          <div className="flex h-fit w-fit flex-col">
            <span className="text-14-regular text-gray-20">{nickname}</span>
            <span className="text-12-light text-gray-56">{date}</span>
          </div>
        ) : (
          <span className="text-14-regular text-gray-20">{nickname}</span>
        )}
      </div>

      {showMenu ? (
        <button
          type="button"
          aria-label="댓글 메뉴 열기"
          className="flex h-fit w-fit gap-2.5"
          onClick={onMenuClick}
        >
          <MoreVertIcon className="h-8 w-8" />
        </button>
      ) : null}
    </div>
  );
}
