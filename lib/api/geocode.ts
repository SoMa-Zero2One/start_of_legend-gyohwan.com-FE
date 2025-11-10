/**
 * Geocoding API 클라이언트
 * 백엔드 프록시를 통해 Google Maps Geocoding API 호출
 */

export interface GeocodeResult {
  geometry: {
    location: {
      lat: number;
      lng: number;
    };
  };
  formatted_address: string;
}

export interface GeocodeResponse {
  results: GeocodeResult[];
  status: string;
}

/**
 * 주소로 위도/경도 검색
 * @param address - 검색할 주소 (대학명, 주소 등)
 * @returns Geocoding 결과
 * @throws {Error} API 호출 실패 시
 */
export const geocodeAddress = async (address: string): Promise<GeocodeResponse> => {
  const response = await fetch("/api/geocode", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ address }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ error: "알 수 없는 오류" }));
    throw new Error(errorData.error || "위치 검색 실패");
  }

  return await response.json();
};
