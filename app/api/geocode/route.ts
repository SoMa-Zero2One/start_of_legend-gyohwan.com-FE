import { NextRequest, NextResponse } from "next/server";

/**
 * USAGE: 대학 위치 Geocoding API 프록시
 *
 * WHAT: Google Maps Geocoding API를 서버에서 호출
 *
 * WHY:
 * - API 키 보호 (클라이언트 노출 방지)
 * - Rate limiting 가능
 * - 비용 제어
 *
 * ALTERNATIVES:
 * - 클라이언트에서 직접 호출 (rejected: API 키 노출)
 * - 백엔드에서 location 제공 (최선이지만 현재는 없음)
 */
export async function POST(request: NextRequest) {
  try {
    const { address } = await request.json();

    // 입력 검증
    if (!address || typeof address !== "string") {
      return NextResponse.json({ error: "주소가 필요합니다." }, { status: 400 });
    }

    // API 키 확인 (서버 전용, NEXT_PUBLIC_ 없음)
    const apiKey = process.env.GOOGLE_MAPS_API_KEY;

    if (!apiKey) {
      console.error("[Geocode API] GOOGLE_MAPS_API_KEY not found");
      return NextResponse.json({ error: "서버 설정 오류" }, { status: 500 });
    }

    // Google Geocoding API 호출
    const geocodeUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${apiKey}`;

    const response = await fetch(geocodeUrl);

    if (!response.ok) {
      console.error("[Geocode API] Google API error:", response.status);
      return NextResponse.json({ error: "위치 검색 실패" }, { status: response.status });
    }

    const data = await response.json();

    // Google API 에러 응답 처리
    if (data.status !== "OK") {
      console.error("[Geocode API] Google API status:", data.status);
      return NextResponse.json(
        {
          error: "위치를 찾을 수 없습니다.",
          status: data.status,
        },
        { status: 400 }
      );
    }

    // 성공 응답
    return NextResponse.json({
      results: data.results,
      status: data.status,
    });
  } catch (error) {
    console.error("[Geocode API] Error:", error);
    return NextResponse.json({ error: "서버 오류가 발생했습니다." }, { status: 500 });
  }
}
