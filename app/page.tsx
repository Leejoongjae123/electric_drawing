import Link from "next/link";

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <div className="text-center space-y-6">
        <h1 className="text-4xl font-bold text-gray-800 dark:text-white">
          회로도 에디터
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          드래그앤드랍으로 컴포넌트를 배치하고 연결하세요
        </p>
        <Link
          href="/circuit"
          className="inline-block bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
        >
          에디터 시작하기
        </Link>
      </div>
    </div>
  );
}
