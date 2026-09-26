type Title24TextBoxProps = {
  variant: '24';
  title: string;
  subtitle?: string;
  text?: never;
};

type Title16TextBoxProps = {
  variant: '16';
  title: string;
  subtitle?: string;
  text?: never;
};

type TextBoxProps = {
  variant: 'text';
  text: string;
  title?: never;
  subtitle?: never;
};

type CustomTextBoxProps = Title24TextBoxProps | Title16TextBoxProps | TextBoxProps;

type Title24ContentProps = {
  title: string;
  subtitle?: string;
};

type Title16ContentProps = {
  title: string;
  subtitle?: string;
};

type TextContentProps = {
  text: string;
};

function Title24TextBox({ title, subtitle }: Title24ContentProps) {
  return (
    <div className="flex h-fit w-[688px] max-w-full flex-col justify-center gap-3 px-4 py-3">
      <h2 className="text-24-medium line-clamp-1 text-black">{title}</h2>
      {subtitle && <p className="text-14-light line-clamp-1 text-gray-20">{subtitle}</p>}
    </div>
  );
}

function Title16TextBox({ title, subtitle }: Title16ContentProps) {
  return (
    <div className="flex h-fit w-full flex-col justify-center gap-2 px-4 py-3">
      <h2 className="text-16-medium line-clamp-1 text-black">{title}</h2>
      {subtitle && <p className="text-14-light line-clamp-2 text-gray-20">{subtitle}</p>}
    </div>
  );
}

function TextOnlyBox({ text }: TextContentProps) {
  return (
    <div className="h-fit w-[688px] max-w-full px-4 py-3">
      <p className="text-14-light whitespace-pre-wrap text-gray-20">{text}</p>
    </div>
  );
}

/**
 * variant별 필수 입력값
 * - `24`: `title` 필수, `subtitle` 선택
 * - `16`: `title` 필수, `subtitle` 선택
 * - `text`: `text`
 *
 * @returns 형태에 맞는 제목과 내용을 표시하는 텍스트 박스
 */
export function CustomTextBox(props: CustomTextBoxProps) {
  if (props.variant === 'text') {
    return <TextOnlyBox text={props.text} />;
  }

  if (props.variant === '24') {
    return <Title24TextBox title={props.title} subtitle={props.subtitle} />;
  }

  return <Title16TextBox title={props.title} subtitle={props.subtitle} />;
}
