import { useEffect } from 'react';

import { useLocation } from 'react-router';

export function useRouteScroll() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash === '#post-comments') document.getElementById('post-comments')?.scrollIntoView();
    else window.scrollTo(0, 0);
  }, [pathname, hash]);
}
