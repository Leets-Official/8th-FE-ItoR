import { useState } from 'react';

import { useNavigate } from 'react-router';

import { PREVIEW_USER } from '@/shared/mocks/previewUser';

export function useLayoutAuth() {
  const navigate = useNavigate();
  const [loginOpen, setLoginOpen] = useState(false);
  const [writeAfterLogin, setWriteAfterLogin] = useState(false);
  const [previewSignedIn, setPreviewSignedIn] = useState(false);

  function openLogin() {
    setLoginOpen(true);
  }

  function changeLoginOpen(open: boolean) {
    setLoginOpen(open);
    if (!open) setWriteAfterLogin(false);
  }

  function completeLogin() {
    setPreviewSignedIn(true);
    setLoginOpen(false);
    setWriteAfterLogin(false);
    if (writeAfterLogin) navigate('/posts/new');
  }

  function startWriting() {
    if (previewSignedIn) navigate('/posts/new');
    else {
      setWriteAfterLogin(true);
      openLogin();
    }
  }

  return {
    loginOpen,
    previewUser: previewSignedIn ? PREVIEW_USER : null,
    setPreviewSignedIn,
    openLogin,
    changeLoginOpen,
    completeLogin,
    startWriting,
  };
}
