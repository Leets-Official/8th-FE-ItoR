import { useRef, useState, type ChangeEvent } from 'react';

import { AddPhotoAlternateIcon } from '@/shared/assets/icons/icons';
import { Avatar } from '@/shared/ui/avatar/Avatar';
import { ActionButton } from '@/shared/ui/button/ActionButton';

type ProfileImageFieldProps = {
  /** 카카오 계정처럼 처음부터 표시할 프로필 이미지 URL입니다. */
  initialImageUrl?: string;
  /** 사용자가 선택한 이미지 파일을 회원가입 폼에 전달합니다. */
  onChange: (file: File) => void;
};

/** 프로필 이미지 선택 버튼과 선택한 이미지 미리보기를 표시합니다. */
export function ProfileImageField({ initialImageUrl = '', onChange }: ProfileImageFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState(initialImageUrl);
  const [errorMessage, setErrorMessage] = useState('');

  function openFilePicker() {
    inputRef.current?.click();
  }

  function selectImage(event: ChangeEvent<HTMLInputElement>) {
    const file = event.currentTarget.files?.[0];
    event.currentTarget.value = '';

    if (!file) {
      return;
    }

    if (!file.type.startsWith('image/')) {
      setErrorMessage('이미지 파일만 선택할 수 있습니다.');
      return;
    }

    const reader = new FileReader();
    reader.addEventListener('load', () => {
      if (typeof reader.result === 'string') {
        setPreviewUrl(reader.result);
      }
    });
    reader.readAsDataURL(file);

    setErrorMessage('');
    onChange(file);
  }

  return (
    <div className="flex h-fit w-full max-w-[688px] flex-col gap-4 px-4 py-3">
      <div className="flex h-fit w-full gap-2.5 px-1.5">
        <span className="text-14-light text-gray-56">프로필 사진</span>
      </div>

      <div className="flex h-fit w-fit flex-col gap-4">
        <Avatar size="large" src={previewUrl || undefined} />
        <ActionButton
          icon={AddPhotoAlternateIcon}
          hasBorder={true}
          text="프로필 사진 추가"
          onClick={openFilePicker}
        />
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          aria-label="프로필 사진 선택"
          className="hidden"
          onChange={selectImage}
        />
      </div>

      {errorMessage ? (
        <p role="alert" className="text-12-light px-1.5 text-negative">
          * {errorMessage}
        </p>
      ) : null}
    </div>
  );
}
