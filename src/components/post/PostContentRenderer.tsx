import type { PostContent } from '@/types/post';

interface PostContentRendererProps {
  contents: PostContent[];
}

/** contentOrder 순서대로 텍스트 / 이미지 / 코드 블록을 그린다. */
function PostContentRenderer({ contents }: PostContentRendererProps) {
  const orderedContents = [...contents].sort((a, b) => a.contentOrder - b.contentOrder);

  return (
    <div className="flex flex-col gap-6">
      {orderedContents.map(({ contentOrder, type, value }) => {
        if (type === 'IMAGE') {
          return (
            <img
              key={contentOrder}
              src={value}
              alt=""
              loading="lazy"
              decoding="async"
              className="max-h-[480px] w-full rounded-sm object-cover"
            />
          );
        }
        if (type === 'CODE') {
          return (
            <pre
              key={contentOrder}
              className="overflow-x-auto rounded-xs bg-code p-4 font-mono text-xs leading-relaxed text-gray-100 md:text-sm"
            >
              <code>{value}</code>
            </pre>
          );
        }
        return (
          <p
            key={contentOrder}
            className="text-sm leading-relaxed font-light whitespace-pre-wrap text-gray-700 md:text-base"
          >
            {value}
          </p>
        );
      })}
    </div>
  );
}

export default PostContentRenderer;
