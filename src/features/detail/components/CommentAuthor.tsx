import { MoreVertIcon } from '@/shared/assets/icons/icons';
import { toSecureImageUrl } from '@/shared/utils/image';

type CommentAuthorProps = {
  nickName: string;
  profileUrl?: string;
  date?: string;
  showMenu?: boolean;
  onMenuClick?: () => void;
  menuId?: string;
  isMenuOpen?: boolean;
};

export function CommentAuthor({
  nickName,
  profileUrl,
  date,
  showMenu = false,
  onMenuClick,
  menuId,
  isMenuOpen = false,
}: CommentAuthorProps) {
  return (
    <div className="flex h-fit w-full items-center">
      <div className="flex w-full items-center gap-1.5 px-4 py-3">
        {profileUrl ? (
          <img
            src={toSecureImageUrl(profileUrl)}
            alt=""
            width={20}
            height={20}
            loading="lazy"
            decoding="async"
            className="h-5 w-5 rounded-full object-cover"
          />
        ) : (
          <span aria-hidden="true" className="h-5 w-5 rounded-full bg-black" />
        )}

        {date ? (
          <div className="flex h-fit w-fit flex-col">
            <span className="text-14-regular text-gray-20">{nickName}</span>
            <span className="text-12-light text-gray-56">{date}</span>
          </div>
        ) : (
          <span className="text-14-regular text-gray-20">{nickName}</span>
        )}
      </div>

      {showMenu ? (
        <button
          type="button"
          aria-label="댓글 메뉴 열기"
          aria-controls={menuId}
          aria-expanded={isMenuOpen}
          aria-haspopup="menu"
          className="flex h-fit w-fit gap-2.5"
          onClick={onMenuClick}
        >
          <MoreVertIcon className="h-8 w-8" />
        </button>
      ) : null}
    </div>
  );
}
