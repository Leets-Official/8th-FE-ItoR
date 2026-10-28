import type { PostContentBlock } from '../model/types';
import { TextBlock } from '@/shared/ui';

interface PostContentProps {
  content: PostContentBlock[];
}

export function PostContent({ content }: PostContentProps) {
  return (
    <div className="flex w-full flex-col">
      {content.map((block, index) =>
        block.type === 'text' ? (
          <TextBlock key={index} className="whitespace-pre-line">
            {block.text}
          </TextBlock>
        ) : (
          <div key={index} className="px-4 py-3">
            <img src={block.imageUrl} alt="" loading="lazy" className="w-full rounded-sm" />
          </div>
        ),
      )}
    </div>
  );
}
