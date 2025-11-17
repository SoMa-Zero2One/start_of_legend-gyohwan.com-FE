import Link from "next/link";
import ChevronRightIcon from "@/components/icons/ChevronRightIcon";
import type { EnrichedCountry } from "@/types/community";

interface CountryListItemProps {
  country: EnrichedCountry;
}

export default function CountryListItem({ country }: CountryListItemProps) {
  const emoji = getFlagEmoji(country.countryCode);

  return (
    <Link
      href={`/community/country/${country.countryCode}`}
      className="interactive-card flex w-full items-center justify-between rounded-[12px] border border-gray-100 bg-white p-[16px] shadow-[0_0_8px_0_rgba(0,0,0,0.06)] transition-shadow hover:shadow-[0_4px_12px_rgba(0,0,0,0.12)]"
    >
      <div className="flex items-center gap-[12px]">
        <div className="flex h-[48px] w-[48px] items-center justify-center rounded-full bg-gray-100 text-2xl">{emoji}</div>
        <div className="text-left">
          <p className="subhead-3">{country.name}</p>
          <p className="caption-2 text-gray-600">{country.continent}</p>
        </div>
      </div>
      <ChevronRightIcon size={20} />
    </Link>
  );
}

function getFlagEmoji(countryCode: string) {
  if (!countryCode) return "🌐";
  const upperCode = countryCode.toUpperCase();
  if (upperCode.length !== 2) return "🌐";
  const OFFSET = 127397;
  const emoji = upperCode
    .split("")
    .map((char) => char.charCodeAt(0) + OFFSET)
    .map((codePoint) => String.fromCodePoint(codePoint))
    .join("");
  return emoji || "🌐";
}
