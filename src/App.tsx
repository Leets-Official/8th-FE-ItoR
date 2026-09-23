import { useState } from 'react';

function App() {
  const [count, setCount] = useState(0);

  return (
    <main className="mx-auto flex min-h-screen max-w-3xl flex-col items-center justify-center gap-6 px-6">
      <h1 className="text-3xl font-bold text-blue-600">ItoR Blog</h1>
      <p>프로젝트 초기 설정이 완료되었습니다.</p>
      <button
        type="button"
        className="rounded-lg bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
        onClick={() => setCount((previousCount) => previousCount + 1)}
      >
        클릭 횟수: {count}
      </button>
    </main>
  );
}

export default App;
