"use client";

/**
 * Sentry 테스트 페이지
 * 클라이언트 사이드 에러 추적을 테스트합니다.
 */
export default function SentryExamplePage() {
  const handleTestError = () => {
    // 존재하지 않는 함수 호출하여 에러 발생
    // @ts-expect-error - 테스트용 에러 발생
    myUndefinedFunction();
  };

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-[430px] flex-col items-center justify-center gap-6 px-[20px]">
      <h1 className="text-2xl font-bold">Sentry 테스트</h1>

      <div className="body-2 flex flex-col gap-2 text-center text-gray-600">
        <p>아래 버튼을 클릭하면 테스트 에러가 발생합니다.</p>
        <p>Sentry 대시보드에서 에러를 확인할 수 있습니다.</p>
      </div>

      <button
        onClick={handleTestError}
        className="btn-primary body-1 w-full cursor-pointer rounded-[4px] py-[12px]"
      >
        테스트 에러 발생
      </button>

      <div className="body-3 rounded-lg bg-gray-100 p-4 text-center text-gray-600">
        <p className="font-semibold">확인 방법:</p>
        <p className="mt-2">
          1. 버튼 클릭
          <br />
          2. 콘솔에서 에러 확인
          <br />
          3. Sentry Issues 탭에서 확인
        </p>
      </div>
    </div>
  );
}
