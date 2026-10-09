import { useCallback, useEffect, useRef } from 'react';

export function usePostImageUrls() {
  const imageUrls = useRef(new Set<string>());
  const trackImage = useCallback((url: string) => {
    imageUrls.current.add(url);
  }, []);
  const releaseImage = useCallback((url: string) => {
    imageUrls.current.delete(url);
    URL.revokeObjectURL(url);
  }, []);

  useEffect(() => {
    const urls = imageUrls.current;
    return () => {
      urls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, []);

  return { trackImage, releaseImage };
}
