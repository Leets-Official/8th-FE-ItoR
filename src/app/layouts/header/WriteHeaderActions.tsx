import { Button } from '@/shared/ui/primitives/button';

export function WriteHeaderActions() {
  return (
    <>
      <Button
        type="reset"
        form="post-editor"
        variant="ghost"
        className="h-10 px-2 text-sm font-normal text-gitlog-danger sm:px-3"
      >
        삭제하기
      </Button>
      <Button
        type="submit"
        form="post-editor"
        variant="ghost"
        className="h-10 px-2 text-sm font-normal text-black sm:px-3"
      >
        게시하기
      </Button>
    </>
  );
}
