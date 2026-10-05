/** 블로그 작성 페이지의 제목 입력 영역입니다. */

import { useState, type ChangeEvent } from 'react';

import { Spacer } from '@/shared/ui/spacing/Spacer';

export function WriteTitleSection() {
  const [title, setTitle] = useState('');

  function handleTitleChange(event: ChangeEvent<HTMLInputElement>) {
    setTitle(event.currentTarget.value);
  }

  return (
    <section className="flex h-fit w-full flex-col items-center border-b border-b-gray-96 bg-white">
      <Spacer variant="32" />

      <div className="flex h-fit w-full max-w-[688px] flex-col px-4 py-3">
        <input
          type="text"
          name="title"
          aria-label="블로그 제목"
          className={`w-full bg-transparent text-black outline-none placeholder:text-gray-56 ${
            title ? 'text-24-medium' : 'text-16-medium'
          }`}
          onChange={handleTitleChange}
          placeholder="제목"
          value={title}
        />
      </div>

      <Spacer variant="32" />
    </section>
  );
}
/** 블로그 작성 페이지의 제목 입력 영역입니다. */
