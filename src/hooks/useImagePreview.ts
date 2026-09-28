import { useEffect, useState } from 'react';

/**
 * 선택한 이미지 파일을 미리보기 URL로 바꿔 보관한다.
 * URL이 바뀌거나 컴포넌트가 사라지면 이전 blob URL을 해제해 메모리 누수를 막는다.
 */
export const useImagePreview = (initialUrl: string | null = null) => {
  const [previewUrl, setPreviewUrl] = useState(initialUrl);

  useEffect(() => {
    return () => {
      if (previewUrl?.startsWith('blob:')) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const selectImage = (file: File) => setPreviewUrl(URL.createObjectURL(file));

  return { previewUrl, selectImage };
};
