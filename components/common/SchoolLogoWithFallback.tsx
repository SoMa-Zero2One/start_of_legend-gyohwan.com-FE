"use client";

import { useState } from "react";
import Image from "next/image";

interface SchoolLogoWithFallbackProps {
  src?: string | null;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  fill?: boolean;
  sizes?: string;
  isLoading?: boolean;
}

export default function SchoolLogoWithFallback({
  src,
  alt,
  width,
  height,
  className = "",
  fill = false,
  sizes,
  isLoading = false,
}: SchoolLogoWithFallbackProps) {
  const [imageError, setImageError] = useState(false);

  // 로딩 중일 때 Skeleton 표시
  if (isLoading) {
    return (
      <div
        className={`animate-pulse rounded-full bg-gray-200 ${className}`}
        style={{ width: width || "100%", height: height || "100%" }}
      />
    );
  }

  // src에 프로토콜이 없으면 https:// 추가
  const imageSrc = src && !src.startsWith('http://') && !src.startsWith('https://') && !src.startsWith('//')
    ? `https://${src}`
    : src;

  // src가 없거나 에러가 발생한 경우 fallback SVG 표시
  if (!imageSrc || imageError) {
    return (
      <div className={`flex items-center justify-center ${className}`}>
        <svg
          width={width || "100%"}
          height={height || "100%"}
          viewBox="0 0 64 64"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* 학교 건물 */}
          <rect x="12" y="28" width="40" height="28" fill="#E5E7EB" />

          {/* 지붕 */}
          <path d="M8 28 L32 16 L56 28 Z" fill="#9CA3AF" />

          {/* 문 */}
          <rect x="26" y="40" width="12" height="16" fill="#6B7280" rx="1" />

          {/* 창문들 */}
          <rect x="16" y="32" width="6" height="6" fill="#9CA3AF" rx="1" />
          <rect x="42" y="32" width="6" height="6" fill="#9CA3AF" rx="1" />
          <rect x="16" y="42" width="6" height="6" fill="#9CA3AF" rx="1" />
          <rect x="42" y="42" width="6" height="6" fill="#9CA3AF" rx="1" />

          {/* 깃대 */}
          <line x1="32" y1="16" x2="32" y2="8" stroke="#6B7280" strokeWidth="1" />

          {/* 깃발 */}
          <path d="M32 8 L38 10 L32 12 Z" fill="#056DFF" />
        </svg>
      </div>
    );
  }

  // 정상적인 이미지 표시
  if (fill) {
    return (
      <Image
        src={imageSrc}
        alt={alt}
        fill
        sizes={sizes}
        className={className}
        onError={() => setImageError(true)}
      />
    );
  }

  return (
    <Image
      src={imageSrc}
      alt={alt}
      width={width!}
      height={height!}
      className={className}
      onError={() => setImageError(true)}
    />
  );
}
