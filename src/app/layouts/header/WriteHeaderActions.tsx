import { Button } from '@/shared/ui/primitives/button';

export function WriteHeaderActions({
  editing = false,
  pending = false,
}: {
  editing?: boolean;
  pending?: boolean;
}) {
  return (
    <>
      <Button
        type="reset"
        form="post-editor"
        disabled={pending}
        variant="ghost"
        className="h-10 px-2 text-sm font-normal text-gitlog-danger sm:px-3"
      >
        삭제하기
      </Button>
      <Button
        type="submit"
        form="post-editor"
        disabled={pending}
        variant="ghost"
        className="h-10 px-2 text-sm font-normal text-black sm:px-3"
      >
        {pending ? '저장 중...' : editing ? '저장하기' : '게시하기'}
      </Button>
    </>
  );
}
