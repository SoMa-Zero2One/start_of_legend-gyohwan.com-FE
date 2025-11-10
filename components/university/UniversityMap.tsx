"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { geocodeAddress } from "@/lib/api/geocode";

// Google Maps 타입 선언 (Map, Marker만 사용)
interface GoogleMaps {
  maps: {
    Map: new (element: HTMLElement, options: unknown) => unknown;
    Marker: new (options: unknown) => unknown;
  };
}

declare global {
  interface Window {
    google: GoogleMaps;
  }
}

interface UniversityMapProps {
  universityName: string;
  countryName?: string | null;
}

interface LocationData {
  lat: number;
  lng: number;
  address: string;
}

/**
 * USAGE: UniversityDetailContent에서 위치 탭에 사용
 *
 * WHAT: Google Maps API로 대학 위치 검색 + 지도 표시
 *
 * WHY:
 * - 백엔드에 위치 정보 없어도 동적으로 검색 가능
 * - Google Geocoding API로 대학명 → 위도/경도 변환
 * - Google Maps로 시각적 위치 표시
 *
 * ALTERNATIVES:
 * - iframe embed (rejected: 커스터마이징 제한)
 * - 백엔드에서 위도/경도 제공 (최선이지만 현재는 없음)
 */
export default function UniversityMap({ universityName, countryName }: UniversityMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const [location, setLocation] = useState<LocationData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 지도 렌더링 함수
  const renderMap = useCallback(
    (locationData: LocationData) => {
      if (!mapRef.current) return;

      try {
        const map = new window.google.maps.Map(mapRef.current, {
          center: { lat: locationData.lat, lng: locationData.lng },
          zoom: 14,
          disableDefaultUI: false,
          zoomControl: false,
          mapTypeControl: true,
          streetViewControl: true,
          fullscreenControl: true,
        });

        // 마커 추가
        new window.google.maps.Marker({
          position: { lat: locationData.lat, lng: locationData.lng },
          map: map,
          title: universityName,
        });
      } catch (err) {
        console.error("[UniversityMap] Error creating map:", err);
      }
    },
    [universityName]
  );

  useEffect(() => {
    // Google Maps 스크립트 로드 (지도 표시용 API 키)
    const loadGoogleMaps = () => {
      const mapsJsApiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_JS_API_KEY;

      if (!mapsJsApiKey) {
        setError("Google Maps API 키가 설정되지 않았습니다.");
        setLoading(false);
        return;
      }

      // 이미 로드되었는지 확인 (window.google 체크)
      if (window.google && window.google.maps) {
        searchLocation();
        return;
      }

      // 스크립트 태그가 이미 DOM에 있는지 체크 (중복 방지)
      const existingScript = document.querySelector('script[src^="https://maps.googleapis.com/maps/api/js"]');
      if (existingScript) {
        // 스크립트는 있지만 아직 로드 안됨 → 로드 완료 대기
        existingScript.addEventListener("load", () => searchLocation());
        return;
      }

      // 새로운 스크립트 태그 생성 (지도 표시용 API 키, Geocoding은 백엔드에서)
      const script = document.createElement("script");
      script.src = `https://maps.googleapis.com/maps/api/js?key=${mapsJsApiKey}&v=weekly`;
      script.async = true;
      script.defer = true;
      script.onload = () => searchLocation();
      script.onerror = () => {
        setError("Google Maps를 로드하지 못했습니다.");
        setLoading(false);
      };
      document.head.appendChild(script);
    };

    // 대학 위치 검색 (백엔드 프록시 사용)
    const searchLocation = async () => {
      try {
        const searchQuery = countryName ? `${universityName}, ${countryName}` : universityName;

        // 백엔드 API로 Geocoding 요청
        const data = await geocodeAddress(searchQuery);

        if (data.status === "OK" && data.results && data.results[0]) {
          const result = data.results[0];
          const locationData: LocationData = {
            lat: result.geometry.location.lat,
            lng: result.geometry.location.lng,
            address: result.formatted_address,
          };

          setLocation(locationData);
          setLoading(false);
        } else {
          setError("위치를 찾을 수 없습니다.");
          setLoading(false);
        }
      } catch (err) {
        console.error("[UniversityMap] Geocoding error:", err);
        setError(err instanceof Error ? err.message : "위치 검색 중 오류가 발생했습니다.");
        setLoading(false);
      }
    };

    loadGoogleMaps();
  }, [universityName, countryName]);

  // location이 설정되면 지도 렌더링
  useEffect(() => {
    if (location && mapRef.current) {
      renderMap(location);
    }
  }, [location, renderMap]);

  if (loading) {
    return (
      <div className="flex flex-col gap-[12px]">
        <div className="flex h-[250px] animate-pulse items-center justify-center rounded-[8px] bg-gray-100">
          <p className="text-gray-500">지도 로딩중...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col gap-[12px]">
        <div className="flex h-[250px] items-center justify-center rounded-[8px] border border-gray-300 bg-gray-100">
          <p className="text-gray-500">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-[12px]">
      {/* 지도 */}
      <div ref={mapRef} className="h-[250px] w-full overflow-hidden rounded-[8px] border border-gray-300" />

      {/* 주소 */}
      {location && (
        <div className="flex items-start gap-[8px] rounded-[8px] bg-gray-50 p-[12px]">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="mt-[2px] h-5 w-5 flex-shrink-0 text-gray-600"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
              clipRule="evenodd"
            />
          </svg>
          <p className="body-2 text-gray-700">{location.address}</p>
        </div>
      )}
    </div>
  );
}
