import { Toaster as Sonner, type ToasterProps } from 'sonner';
import { TOAST_OFFSET_TOP_VAR } from './useToastOffset';

// 시안: 상단 고정 헤더(72px) 아래, 화면 위에서 100px 지점 가운데에 뜬다
// 헤더 아래에 줄이 하나 더 붙는 페이지는 useToastOffset으로 CSS 변수를 바꿔 그 아래로 내린다
const TOAST_OFFSET = `var(${TOAST_OFFSET_TOP_VAR}, 100px)`;

// toast.custom은 sonner 기본 스타일이 빠져 토스트가 목록(356px) 왼쪽에 붙으므로 목록 너비로 펴고 가운데 정렬한다
export function Toaster(props: ToasterProps) {
  return (
    <Sonner
      position="top-center"
      offset={TOAST_OFFSET}
      mobileOffset={TOAST_OFFSET}
      toastOptions={{ className: 'flex w-full justify-center' }}
      {...props}
    />
  );
}
