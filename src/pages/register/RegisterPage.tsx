/** @returns 회원가입 UI가 배치될 반응형 콘텐츠 틀 */
function RegisterPage() {
  return (
    <section className="mx-auto flex min-h-[calc(100dvh-104px)] w-full max-w-[480px] flex-col gap-6 py-10 mobile:py-6">
      <div className="h-10 w-40 rounded bg-gray-96" />
      <div className="flex w-full flex-col gap-4">
        <div className="h-20 w-full rounded bg-gray-96" />
        <div className="h-20 w-full rounded bg-gray-96" />
        <div className="h-12 w-full rounded bg-gray-96" />
      </div>
    </section>
  );
}

export default RegisterPage;
