import Image from "next/image";
import { COUNTRY_NAME_TO_CODE, SUPPORTED_COUNTRY_CODES } from "@/lib/constants/countryNameMap";
import { COUNTRY_NAME_ALIASES } from "@/lib/constants/countryNameAliases";

interface CountryFlagProps {
  country: string | null;
  size?: number;
  className?: string;
}

const ISO_CODE_SET: Set<string> = new Set(SUPPORTED_COUNTRY_CODES as readonly string[]);

function resolveCountryCode(rawCountry?: string | null): string | null {
  if (!rawCountry) {
    return null;
  }

  const trimmed = rawCountry.trim();
  if (!trimmed) {
    return null;
  }

  const normalizedCode = trimmed.toUpperCase();

  if (ISO_CODE_SET.has(normalizedCode)) {
    return normalizedCode.toLowerCase();
  }

  return COUNTRY_NAME_TO_CODE[trimmed] ?? COUNTRY_NAME_ALIASES[trimmed] ?? null;
}

export default function CountryFlag({ country, size = 20, className = "" }: CountryFlagProps) {
  const resolvedCode = resolveCountryCode(country);

  if (!resolvedCode) {
    return (
      <span className={className} style={{ fontSize: `${size}px`, lineHeight: 1 }}>
        🌍
      </span>
    );
  }

  const accessibleLabel = country ?? "국가";

  return (
    <Image src={`/flags/${resolvedCode}.svg`} alt={`${accessibleLabel} 국기`} width={size} height={size} className={className} />
  );
}
