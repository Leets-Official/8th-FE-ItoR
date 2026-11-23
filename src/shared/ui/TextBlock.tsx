import type { ReactNode } from 'react';
import { cn } from '@/shared/lib/utils';

export type TextBlockVariant = 'title' | 'section' | 'body';

type HeadingLevel = 1 | 2 | 3 | 4 | 5 | 6;
type HeadingTag = `h${HeadingLevel}`;

interface TextBlockBaseProps {
  children: ReactNode;
  className?: string;
}

interface BodyTextBlockProps extends TextBlockBaseProps {
  variant?: 'body';
  title?: never;
  headingLevel?: never;
}

interface TitledTextBlockProps extends TextBlockBaseProps {
  variant: 'title' | 'section';
  title: ReactNode;
  headingLevel?: HeadingLevel;
}

type TextBlockProps = BodyTextBlockProps | TitledTextBlockProps;

const CONTAINER_CLASS: Record<TextBlockVariant, string> = {
  title: 'flex-col items-start justify-center gap-3',
  section: 'flex-col items-start justify-center gap-2',
  body: 'items-center justify-center',
};

const TITLE_CLASS: Record<Exclude<TextBlockVariant, 'body'>, string> = {
  title: 'text-24 font-medium text-black',
  section: 'text-16 font-medium text-black',
};

export function TextBlock(props: TextBlockProps) {
  const { children, className } = props;
  const variant = props.variant ?? 'body';

  return (
    <div className={cn('flex w-full bg-white px-4 py-3', CONTAINER_CLASS[variant], className)}>
      {props.variant !== undefined && props.variant !== 'body' && (
        <TextBlockHeading variant={props.variant} level={props.headingLevel}>
          {props.title}
        </TextBlockHeading>
      )}
      <p className="w-full text-14 font-light text-gray-20">{children}</p>
    </div>
  );
}

interface TextBlockHeadingProps {
  variant: Exclude<TextBlockVariant, 'body'>;
  level?: HeadingLevel;
  children: ReactNode;
}

function TextBlockHeading({ variant, level, children }: TextBlockHeadingProps) {
  const Heading = `h${level ?? (variant === 'title' ? 1 : 2)}` as HeadingTag;

  return <Heading className={cn('w-full', TITLE_CLASS[variant])}>{children}</Heading>;
}
