export async function optimizeImage(file: File, maxDimension: number): Promise<File> {
  // JPEG만 재인코딩해 다른 포맷의 투명도와 애니메이션을 보존한다.
  if (file.type !== 'image/jpeg') return file;

  const src = URL.createObjectURL(file);
  try {
    const image = new Image();
    image.src = src;
    await image.decode();

    const scale = Math.min(1, maxDimension / Math.max(image.naturalWidth, image.naturalHeight));
    const canvas = document.createElement('canvas');
    canvas.width = Math.max(1, Math.round(image.naturalWidth * scale));
    canvas.height = Math.max(1, Math.round(image.naturalHeight * scale));
    const context = canvas.getContext('2d');
    if (!context) return file;

    context.drawImage(image, 0, 0, canvas.width, canvas.height);
    const blob = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob(resolve, 'image/jpeg', 0.85),
    );
    if (!blob || blob.type !== file.type || blob.size >= file.size) return file;

    return new File([blob], file.name, { type: 'image/jpeg', lastModified: file.lastModified });
  } finally {
    URL.revokeObjectURL(src);
  }
}
