import { Icon } from '@/shared/ui';
import { cn } from '@/shared/lib/utils';

interface SignUpPanelProps {
  onEmailSignUp?: () => void;
  onKakaoSignUp?: () => void;
  className?: string;
}

export function SignUpPanel({ onEmailSignUp, onKakaoSignUp, className }: SignUpPanelProps) {
  return (
    <div
      className={cn(
        'flex w-full max-w-[782px] flex-wrap content-center items-center justify-center rounded-[9px] py-20',
        className,
      )}
    >
      <div className="flex min-w-60 flex-1 flex-col items-center">
        <div className="flex h-40 w-full max-w-[344px] min-w-60 items-center justify-center">
          <span className="font-smooch text-[76px] leading-none text-black">GITLOG</span>
        </div>
        <p className="w-full max-w-[344px] min-w-60 px-4 py-3 text-center text-14 font-light text-gray-56">
          You can make anything by writing
        </p>
      </div>

      <div className="flex min-w-60 flex-1 flex-col items-center gap-0.5 px-4">
        <div className="h-[33px] w-full max-w-[344px] min-w-60" />
        <div className="w-full max-w-[344px] min-w-60 px-4 py-1">
          <button
            type="button"
            className="flex h-[45px] w-full cursor-pointer items-center justify-center rounded-[6px] bg-point px-3.5 text-14 text-white hover:brightness-95 active:brightness-90"
            onClick={onEmailSignUp}
          >
            이메일로 회원가입
          </button>
        </div>
        <div className="flex w-[313px] max-w-full items-center justify-center gap-0.5">
          <span className="h-px w-[123px] shrink bg-gray-96" />
          <span className="px-2 pt-0.5 pb-1 text-12 text-gray-56">또는</span>
          <span className="h-px w-[123px] shrink bg-gray-96" />
        </div>
        <div className="w-full max-w-[344px] min-w-60 px-4 py-1">
          <button
            type="button"
            className="flex h-[45px] w-full cursor-pointer items-center justify-center gap-2 rounded-[6px] bg-kakao px-3.5 text-[15px] leading-[1.5] font-medium text-black/85 hover:brightness-95 active:brightness-90"
            onClick={onKakaoSignUp}
          >
            <Icon name="kakao" size={24} />
            카카오로 회원가입
          </button>
        </div>
      </div>
    </div>
  );
}
