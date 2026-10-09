export function SignupHeader({ description }: { description?: string }) {
  return (
    <div className="border-b border-neutral-100 bg-neutral-100 pt-8 pb-5 font-auth">
      <div className="mx-auto w-full max-w-[688px] space-y-3 px-4 py-3">
        <h1 className="text-2xl leading-10 font-medium text-black">회원가입</h1>
        {description && <p className="text-sm leading-6 font-light text-zinc-800">{description}</p>}
      </div>
    </div>
  );
}
