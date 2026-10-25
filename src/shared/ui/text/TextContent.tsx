type Title24VariantProps = {
  variant: '24';
  title: string;
  subtitle?: string;
  text?: never;
};

type Title16VariantProps = {
  variant: '16';
  title: string;
  subtitle?: string;
  text?: never;
};

type TextVariantProps = {
  variant: 'text';
  text: string;
  title?: never;
  subtitle?: never;
};

export type TextContentProps = Title24VariantProps | Title16VariantProps | TextVariantProps;

type Title24ContentProps = {
  title: string;
  subtitle?: string;
};

type Title16ContentProps = {
  title: string;
  subtitle?: string;
};

type TextOnlyContentProps = {
  text: string;
};

function Title24Content({ title, subtitle }: Title24ContentProps) {
  return (
    <div className="flex h-fit w-[688px] max-w-full flex-col justify-center gap-3 px-4 py-3">
      <h2 className="text-24-medium line-clamp-1 text-black">{title}</h2>
      {subtitle && <p className="text-14-light line-clamp-1 text-gray-20">{subtitle}</p>}
    </div>
  );
}

function Title16Content({ title, subtitle }: Title16ContentProps) {
  return (
    <div className="flex h-fit w-full flex-col justify-center gap-2 px-4 py-3">
      <h2 className="text-16-medium line-clamp-1 text-black">{title}</h2>
      {subtitle && <p className="text-14-light line-clamp-2 text-gray-20">{subtitle}</p>}
    </div>
  );
}

function TextOnlyContent({ text }: TextOnlyContentProps) {
  return (
    <div className="h-fit w-[688px] max-w-full px-4 py-3">
      <p className="text-14-light whitespace-pre-wrap text-gray-20">{text}</p>
    </div>
  );
}

/**
 * 제목 또는 본문을 디자인된 줄 수로 표시합니다.
 * - `24`: `title` 필수, `subtitle` 선택이며 부제목은 한 줄로 제한됩니다.
 * - `16`: `title` 필수, `subtitle` 선택이며 부제목은 두 줄로 제한됩니다.
 * - `text`: `text`만 입력하며 줄 수를 제한하지 않습니다.
 */
export function TextContent(props: TextContentProps) {
  if (props.variant === 'text') {
    return <TextOnlyContent text={props.text} />;
  }

  if (props.variant === '24') {
    return <Title24Content title={props.title} subtitle={props.subtitle} />;
  }

  return <Title16Content title={props.title} subtitle={props.subtitle} />;
}
