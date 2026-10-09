import { ChatIcon, MoreVertIcon } from '@/shared/assets/icons';
import { ActionMenu } from '@/shared/ui/ActionMenu';
import { IconButton } from '@/shared/ui/IconButton';
import { Button } from '@/shared/ui/primitives/button';

interface PostHeaderActionsProps {
  onBackToList: () => void;
  onLogin: () => void;
}

export function PostHeaderActions({ onBackToList, onLogin }: PostHeaderActionsProps) {
  return (
    <>
      <Button asChild variant="ghost" size="icon-lg" aria-label="댓글로 이동">
        <a href="#post-comments">
          <ChatIcon aria-hidden="true" className="size-6" />
        </a>
      </Button>
      <ActionMenu
        label="게시글 메뉴 열기"
        trigger={
          <IconButton label="게시글 메뉴 열기" size="lg">
            <MoreVertIcon aria-hidden="true" />
          </IconButton>
        }
        items={[
          { id: 'list', label: '목록으로', onSelect: onBackToList },
          { id: 'login', label: '로그인', onSelect: onLogin },
        ]}
      />
    </>
  );
}
