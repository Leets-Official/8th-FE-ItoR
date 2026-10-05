import type { PostContentBlock } from '../model/post';

export function PostContent({ blocks }: { blocks: PostContentBlock[] }) {
  return (
    <div className="mx-auto w-full max-w-[688px] py-5 sm:py-8">
      {blocks.map((block, index) => (
        <div key={index} className="px-4 py-3">
          {block.type === 'text' ? (
            <p className="text-sm leading-6 font-light break-words whitespace-pre-wrap text-zinc-800">
              {block.text}
            </p>
          ) : (
            <img
              src={block.src}
              alt={block.alt}
              width={block.width}
              height={block.height}
              loading="lazy"
              className="h-auto w-full rounded-sm"
            />
          )}
        </div>
      ))}
    </div>
  );
}
