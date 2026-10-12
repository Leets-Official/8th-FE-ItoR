import { Toaster as Sonner, type ToasterProps } from 'sonner';

// 시안: 상단 고정 헤더(72px) 아래, 화면 위에서 100px 지점 가운데에 뜬다
// toast.custom은 sonner 기본 스타일이 빠져 토스트가 목록(356px) 왼쪽에 붙으므로 목록 너비로 펴고 가운데 정렬한다
export function Toaster(props: ToasterProps) {
  return (
    <Sonner
      position="top-center"
      offset={100}
      mobileOffset={100}
      toastOptions={{ className: 'flex w-full justify-center' }}
      {...props}
    />
  );
}
