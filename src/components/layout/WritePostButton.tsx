import { Pencil } from 'lucide-react';
import { useNavigate } from 'react-router';
import Button from '@/components/common/Button';
import { ROUTES } from '@/constants/routes';
import { useAuth } from '@/hooks/useAuth';
import { useLoginModal } from '@/hooks/useLoginModal';

/** 글쓰기는 로그인이 필요하므로, 로그인 전이면 글쓰기 페이지 대신 로그인 모달을 연다. */
function WritePostButton() {
  const { isLoggedIn } = useAuth();
  const { openLoginModal } = useLoginModal();
  const navigate = useNavigate();

  return (
    <Button
      variant="text"
      onClick={() => (isLoggedIn ? navigate(ROUTES.POST_WRITE) : openLoginModal())}
    >
      <Pencil size={16} aria-hidden />
      깃로그 쓰기
    </Button>
  );
}

export default WritePostButton;
