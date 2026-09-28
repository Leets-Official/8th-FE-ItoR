import { ImagePlus, Plus } from 'lucide-react';
import { useId, type ChangeEvent } from 'react';
import Avatar from '@/components/common/Avatar';

interface ProfileImageInputProps {
  previewUrl: string | null;
  onSelectImage: (file: File) => void;
  /** 회원가입처럼 아바타 아래에 "프로필 사진 추가" 버튼을 따로 보여줄지 */
  showAddButton?: boolean;
}

/** 아바타를 눌러 프로필 사진을 고르면 바로 미리보기로 바뀐다. */
function ProfileImageInput({
  previewUrl,
  onSelectImage,
  showAddButton = false,
}: ProfileImageInputProps) {
  const inputId = useId();

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) onSelectImage(file);
    event.target.value = '';
  };

  return (
    <div className="flex flex-col items-start gap-2">
      <label htmlFor={inputId} className="relative cursor-pointer rounded-full">
        <Avatar src={previewUrl} alt="프로필 사진 미리보기" size="lg" />
        {!showAddButton && (
          <span className="absolute right-0 bottom-0 flex size-5 items-center justify-center rounded-full border border-white bg-ink text-white">
            <Plus size={12} aria-hidden />
          </span>
        )}
        <span className="sr-only">프로필 사진 변경</span>
      </label>
      {showAddButton && (
        <label
          htmlFor={inputId}
          className="inline-flex cursor-pointer items-center gap-1 rounded-xs border border-gray-100 bg-white px-2 py-1 text-[11px] text-gray-500 hover:bg-gray-50"
        >
          <ImagePlus size={12} aria-hidden />
          프로필 사진 추가
        </label>
      )}
      <input
        id={inputId}
        type="file"
        accept="image/*"
        onChange={handleChange}
        className="sr-only"
      />
    </div>
  );
}

export default ProfileImageInput;
