import { revalidatePath } from "next/cache";
import { NextRequest } from "next/server";
import { timingSafeEqual } from "crypto";

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
  // 보안: secret token으로 인증 (타이밍 공격 방지)
  const secret = request.nextUrl.searchParams.get("secret");
  const expectedSecret = process.env.REVALIDATE_SECRET;

  if (!secret || !expectedSecret) {
    return Response.json({ message: "Invalid token" }, { status: 401 });
  }

  // 타이밍 공격 방지를 위한 constant-time comparison
  try {
    const secretBuffer = Buffer.from(secret);
    const expectedBuffer = Buffer.from(expectedSecret);

    // 길이가 다르면 바로 실패 (타이밍 공격 방지를 위해 동일 길이로 패딩)
    if (secretBuffer.length !== expectedBuffer.length) {
      return Response.json({ message: "Invalid token" }, { status: 401 });
    }

    const isValid = timingSafeEqual(secretBuffer, expectedBuffer);

    if (!isValid) {
      return Response.json({ message: "Invalid token" }, { status: 401 });
    }
  } catch {
    return Response.json({ message: "Invalid token" }, { status: 401 });
  }

  try {
    // 홈페이지 캐시 무효화 (즉시 재생성)
    revalidatePath("/");

    return Response.json({
      revalidated: true,
      path: "/",
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    console.error("Revalidation error:", err);
    return Response.json(
      {
        message: "Error revalidating",
        error: err instanceof Error ? err.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
