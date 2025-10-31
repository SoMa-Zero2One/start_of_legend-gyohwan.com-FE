import { setupServer } from 'msw/node';
import { handlers } from './handlers';

// MSW Node 서버 설정 (SSR용)
export const server = setupServer(...handlers);

// Next.js 서버에서 MSW 활성화
export async function enableMocking() {
  if (process.env.NODE_ENV !== 'development') {
    return;
  }

  if (process.env.NEXT_PUBLIC_ENABLE_MSW !== 'true') {
    return;
  }

  server.listen({
    onUnhandledRequest: 'warn',
  });

  console.log('🔶 MSW Server is enabled for SSR');
}
