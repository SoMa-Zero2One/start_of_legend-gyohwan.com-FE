/**
 * Next.js Instrumentation Hook
 * 서버가 시작될 때 한 번만 실행됩니다.
 * MSW Server를 SSR에서 사용하기 위한 초기화
 */

export async function register() {
  // 서버 환경에서만 실행 (Edge Runtime에서는 Node.js API를 사용할 수 없음)
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    const { enableMocking } = await import('./mocks/server');
    await enableMocking();
  }
}
