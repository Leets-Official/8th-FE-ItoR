import { Link } from 'react-router';
import { Button } from '@/shared/ui';

interface PostLoadErrorProps {
  isRetrying: boolean;
  onRetry: () => void;
}

// 서버 장애처럼 글을 불러오지 못했을 때 보여 준다. 없는 글과 달리 다시 시도하면 볼 수 있다
export function PostLoadError({ isRetrying, onRetry }: PostLoadErrorProps) {
  return (
    <main className="flex flex-col items-center gap-4 py-16">
      <p className="text-14 text-gray-56">
        게시글을 불러오지 못했습니다. 잠시 후 다시 시도해주세요.
      </p>
      <div className="flex gap-2">
        <Button variant="outline" disabled={isRetrying} onClick={onRetry}>
          다시 시도
        </Button>
        <Button variant="outline" asChild>
          <Link to="/">목록으로</Link>
        </Button>
      </div>
    </main>
  );
}
