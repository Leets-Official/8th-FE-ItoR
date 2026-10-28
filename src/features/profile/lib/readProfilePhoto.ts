export async function readProfilePhoto(file: File): Promise<string> {
  if (!file.type.startsWith('image/')) throw new Error('이미지 파일을 선택해주세요.');
  if (file.size > 5 * 1024 * 1024) throw new Error('프로필 사진은 5MB 이하로 선택해주세요.');
  const src = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () =>
      typeof reader.result === 'string'
        ? resolve(reader.result)
        : reject(new Error('사진을 불러올 수 없습니다.'));
    reader.onerror = () => reject(new Error('사진을 불러올 수 없습니다.'));
    reader.readAsDataURL(file);
  });
  const image = new Image();
  image.src = src;
  try {
    await image.decode();
  } catch {
    throw new Error('사진을 불러올 수 없습니다. 다른 이미지 파일을 선택해주세요.');
  }
  return src;
}
