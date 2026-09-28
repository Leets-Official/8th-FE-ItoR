function Spinner() {
  return (
    <div role="status" className="flex min-h-[50vh] items-center justify-center">
      <span className="size-8 animate-spin rounded-full border-2 border-gray-100 border-t-point" />
      <span className="sr-only">불러오는 중</span>
    </div>
  );
}

export default Spinner;
