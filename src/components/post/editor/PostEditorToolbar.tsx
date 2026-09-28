import { ImagePlus } from 'lucide-react';
import type { ChangeEvent } from 'react';

interface PostEditorToolbarProps {
  onAddImage: (file: File) => void;
}

function PostEditorToolbar({ onAddImage }: PostEditorToolbarProps) {
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) onAddImage(file);
    event.target.value = '';
  };

  return (
    <div className="flex justify-center border-y border-gray-50 py-2">
      <label className="inline-flex cursor-pointer items-center gap-1 rounded-xs px-2 py-1 text-xs text-gray-500 transition-colors focus-within:outline-2 focus-within:outline-point hover:bg-gray-50">
        <ImagePlus size={14} aria-hidden />
        사진 추가하기
        <input type="file" accept="image/*" onChange={handleChange} className="sr-only" />
      </label>
    </div>
  );
}

export default PostEditorToolbar;
