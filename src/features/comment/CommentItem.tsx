import { useState } from 'react';
import { CommentAuthor } from './CommentAuthor';
import type { PostComment } from './types';
import {
  Blank,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  IconButton,
  Modal,
} from '@/shared/ui';

interface CommentItemProps {
  comment: PostComment;
  // 없으면 더보기 메뉴를 보여주지 않는다 (본인 댓글에만 넘긴다)
  onDelete?: () => void;
}

export function CommentItem({ comment, onDelete }: CommentItemProps) {
  const { author, content, createdAt } = comment;
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  return (
    <li className="flex flex-col">
      <div className="flex items-center">
        <CommentAuthor
          nickname={author.nickname}
          profileImageUrl={author.profileImageUrl}
          createdAt={createdAt}
          className="flex-1 px-4 py-3"
        />
        {onDelete && (
          // modal={false}: 메뉴가 닫히면서 삭제 모달이 열릴 때 body의 pointer-events 잠금이 남는 Radix 문제를 피한다
          <DropdownMenu modal={false}>
            <DropdownMenuTrigger asChild>
              <IconButton icon="more_vert" label="댓글 더보기" />
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onSelect={() => setIsDeleteModalOpen(true)}>
                삭제하기
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>

      {/* 시안: 본문은 프로필 이미지(20px) + 간격(6px)만큼 들여 닉네임과 왼쪽을 맞춘다. 입력한 줄바꿈은 그대로 보여준다 */}
      <p className="py-3 pr-4 pl-[42px] text-14 font-light break-words whitespace-pre-line text-gray-20">
        {content}
      </p>
      <Blank size={20} />

      {onDelete && (
        <Modal
          variant="destructive"
          title="댓글을 삭제할까요?"
          confirmLabel="삭제하기"
          open={isDeleteModalOpen}
          onOpenChange={setIsDeleteModalOpen}
          onConfirm={onDelete}
        />
      )}
    </li>
  );
}
