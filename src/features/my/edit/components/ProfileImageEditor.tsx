import { useRef, type ChangeEvent } from 'react';

import { Avatar } from '@/shared/ui/avatar/Avatar';

type ProfileImageEditorProps = {
  src?: string;
  isEditing: boolean;
  onChange: (file: File, previewUrl: string) => void;
};

/** 프로필 수정 상태에서 기존 사진을 눌러 새 이미지 파일을 선택합니다. */
export function ProfileImageEditor({ src, isEditing, onChange }: ProfileImageEditorProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  function openFilePicker() {
    if (isEditing) {
      inputRef.current?.click();
    }
  }

  function selectImage(event: ChangeEvent<HTMLInputElement>) {
    const file = event.currentTarget.files?.[0];
    event.currentTarget.value = '';

    if (!file?.type.startsWith('image/')) {
      return;
    }

    const reader = new FileReader();
    reader.addEventListener('load', () => {
      if (typeof reader.result === 'string') {
        onChange(file, reader.result);
      }
    });
    reader.readAsDataURL(file);
  }

  return (
    <>
      <button
        type="button"
        aria-label={isEditing ? '프로필 사진 변경' : '프로필 사진'}
        disabled={!isEditing}
        className="rounded-full focus-visible:outline focus-visible:outline-2 focus-visible:outline-point disabled:cursor-default"
        onClick={openFilePicker}
      >
        <Avatar size="medium" src={src} />
      </button>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        aria-label="프로필 사진 파일 선택"
        className="hidden"
        onChange={selectImage}
      />
    </>
  );
}
