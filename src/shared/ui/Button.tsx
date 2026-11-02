import type { ComponentProps, HTMLAttributes, ReactElement } from 'react';
import { cva } from 'class-variance-authority';
import { Slot } from 'radix-ui';
import { cn } from '@/shared/lib/utils';
import { Icon, type IconName } from './Icon';

export type ButtonVariant = 'point' | 'outline' | 'white' | 'black' | 'text';
// 시안에서 사이드바·회원가입·댓글 등록 버튼은 기본(40px)보다 낮은 38px이다
export type ButtonSize = 40 | 38;

const PILL_CLASS = 'rounded-full px-3 text-14';

// text 변형은 글자 크기에 맞춘 높이라 size를 적용하지 않는다
const PILL_SIZE_CLASS: Record<ButtonSize, string> = {
  40: 'h-10',
  38: 'h-[38px]',
};

const buttonVariants = cva(
  'inline-flex shrink-0 cursor-pointer items-center justify-center gap-1 disabled:cursor-default',
  {
    variants: {
      variant: {
        point: `${PILL_CLASS} border border-point bg-white text-point`,
        outline: `${PILL_CLASS} border border-gray-56 text-gray-56`,
        white: `${PILL_CLASS} text-gray-56`,
        black: `${PILL_CLASS} bg-gray-7 text-white disabled:text-gray-56`,
        text: 'rounded-xs px-2 pt-0.5 pb-1 text-12 text-gray-56',
      },
      pressed: { true: '', false: '' },
    },
    compoundVariants: [
      {
        variant: ['outline', 'white'],
        pressed: false,
        className: 'bg-white not-disabled:hover:bg-gray-90 not-disabled:active:bg-gray-90',
      },
      {
        variant: 'text',
        pressed: false,
        className: 'not-disabled:hover:bg-gray-90 not-disabled:active:bg-gray-90',
      },
      { variant: ['outline', 'white', 'text'], pressed: true, className: 'bg-gray-90' },
    ],
    defaultVariants: { variant: 'point', pressed: false },
  },
);

interface CommonButtonProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: IconName;
  pressed?: boolean;
}

interface NativeButtonProps extends ComponentProps<'button'>, CommonButtonProps {
  asChild?: false;
}

// 버튼 전용 속성과 button ref는 자식의 실제 요소에 맞게 자식에서 지정한다.
type ButtonOnlyProps = Exclude<keyof ComponentProps<'button'>, keyof HTMLAttributes<HTMLElement>>;

type ChildButtonProps = CommonButtonProps &
  HTMLAttributes<HTMLElement> & {
    asChild: true;
    children: ReactElement;
  } & {
    [Key in ButtonOnlyProps]?: never;
  };

type ButtonProps = NativeButtonProps | ChildButtonProps;

export function Button({
  variant = 'point',
  size = 40,
  icon,
  pressed = false,
  asChild = false,
  type = 'button',
  className,
  children,
  ...props
}: ButtonProps) {
  const Comp = asChild ? Slot.Root : 'button';

  return (
    <Comp
      data-slot="button"
      type={asChild ? undefined : type}
      className={cn(
        buttonVariants({ variant, pressed }),
        variant !== 'text' && PILL_SIZE_CLASS[size],
        className,
      )}
      {...props}
    >
      {icon && <Icon name={icon} size={variant === 'text' ? 14 : 24} />}
      <Slot.Slottable>{children}</Slot.Slottable>
    </Comp>
  );
}
