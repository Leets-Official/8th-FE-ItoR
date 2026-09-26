type TitleTextBoxProps = {
  variant: '24' | '16';
  title: string;
  subtitle: string;
  text?: never;
};

type TextBoxProps = {
  variant: 'text';
  text: string;
  title?: never;
  subtitle?: never;
};

type CustomTextBoxProps = TitleTextBoxProps | TextBoxProps;

type TitleContentProps = {
  title: string;
  subtitle: string;
};

type TextContentProps = {
  text: string;
};

function Title24TextBox({ title, subtitle }: TitleContentProps) {
  return (
    <div className="flex h-fit w-[688px] max-w-full flex-col gap-3 bg-white px-4 py-3">
      <h2 className="text-24-medium line-clamp-1 text-black">{title}</h2>
      <p className="text-14-light line-clamp-1 text-gray-20">{subtitle}</p>
    </div>
  );
}

function Title16TextBox({ title, subtitle }: TitleContentProps) {
  return (
    <div className="flex h-fit w-full flex-col gap-2 bg-white px-4 py-3">
      <h2 className="text-16-medium line-clamp-1 text-black">{title}</h2>
      <p className="text-14-light line-clamp-2 text-gray-20">{subtitle}</p>
    </div>
  );
}

function TextOnlyBox({ text }: TextContentProps) {
  return (
    <div className="h-fit w-[688px] max-w-full bg-white px-4 py-3">
      <p className="text-14-light whitespace-pre-wrap text-gray-20">{text}</p>
    </div>
  );
}

/**
 * variant: '24', '16', 'text' 중 사용할 텍스트 박스 형태
 * - '24' or '16': title과 subtitle은 필수로 입력
 * - 'text': text는 필수 입력
 * title: '24', '16' 형태에 표시할 제목
 * subtitle: '24', '16' 형태에 표시할 부제목
 * text: 'text' 형태에 표시할 본문
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
