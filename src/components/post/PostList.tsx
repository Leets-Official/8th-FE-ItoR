import EmptyState from '@/components/common/EmptyState';
import type { PostSummary } from '@/types/post';
import PostCard from './PostCard';

interface PostListProps {
  posts: PostSummary[];
  emptyMessage?: string;
}

function PostList({ posts, emptyMessage = '아직 작성된 깃로그가 없습니다.' }: PostListProps) {
  if (posts.length === 0) return <EmptyState message={emptyMessage} />;

  return (
    <ul aria-label="게시물 목록">
      {posts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </ul>
  );
}

export default PostList;
