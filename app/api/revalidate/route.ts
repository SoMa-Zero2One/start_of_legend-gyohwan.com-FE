import { revalidatePath } from 'next/cache';
import { NextRequest } from 'next/server';

/**
 * On-demand Revalidation API
 *
 * 사용 방법:
 * curl -X POST "https://gyohwan.com/api/revalidate?secret=YOUR_SECRET"
 *
 * 또는 브라우저/Postman 등에서:
 * POST https://gyohwan.com/api/revalidate?secret=YOUR_SECRET
 */
export async function POST(request: NextRequest) {
  // 보안: secret token으로 인증
  const secret = request.nextUrl.searchParams.get('secret');

  if (secret !== process.env.REVALIDATE_SECRET) {
    return Response.json({ message: 'Invalid token' }, { status: 401 });
  }

  try {
    // 홈페이지 캐시 무효화 (즉시 재생성)
    revalidatePath('/');

    return Response.json({
      revalidated: true,
      path: '/',
      timestamp: new Date().toISOString()
    });
  } catch (err) {
    console.error('Revalidation error:', err);
    return Response.json({
      message: 'Error revalidating',
      error: err instanceof Error ? err.message : 'Unknown error'
    }, { status: 500 });
  }
}
