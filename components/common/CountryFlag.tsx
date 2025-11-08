import Image from "next/image";

const countryToISO: Record<string, string> = {
  대한민국: "kr",
  일본: "jp",
  중국: "cn",
  홍콩: "hk",
  대만: "tw",
  싱가포르: "sg",
  말레이시아: "my",
  브루나이: "bn",
  인도네시아: "id",
  태국: "th",
  베트남: "vn",
  필리핀: "ph",
  인도: "in",
  카자흐스탄: "kz",
  호주: "au",
  뉴질랜드: "nz",
  미국: "us",
  캐나다: "ca",
  멕시코: "mx",
  브라질: "br",
  아르헨티나: "ar",
  칠레: "cl",
  페루: "pe",
  영국: "gb",
  아일랜드: "ie",
  프랑스: "fr",
  독일: "de",
  네덜란드: "nl",
  벨기에: "be",
  스위스: "ch",
  오스트리아: "at",
  이탈리아: "it",
  스페인: "es",
  포르투갈: "pt",
  덴마크: "dk",
  스웨덴: "se",
  노르웨이: "no",
  핀란드: "fi",
  폴란드: "pl",
  체코: "cz",
  헝가리: "hu",
  슬로바키아: "sk",
  슬로베니아: "si",
  그리스: "gr",
  터키: "tr",
  튀르키예: "tr",
  이스라엘: "il",
  이집트: "eg",
  남아프리카공화국: "za",
  모로코: "ma",
  케냐: "ke",
  나이지리아: "ng",
  러시아: "ru",
  우크라이나: "ua",
  루마니아: "ro",
  불가리아: "bg",
  세르비아: "rs",
  크로아티아: "hr",
  조지아: "ge",
  아르메니아: "am",
  아제르바이잔: "az",
  사우디아라비아: "sa",
  아랍에미리트: "ae",
  카타르: "qa",
  쿠웨이트: "kw",
  요르단: "jo",
  이란: "ir",
  이라크: "iq",
};

interface CountryFlagProps {
  country: string | null;
  size?: number;
  className?: string;
}

export default function CountryFlag({ country, size = 20, className = "" }: CountryFlagProps) {
  // country가 null이거나 매핑되지 않은 경우 기본 아이콘 표시
  if (!country) {
    return (
      <span className={className} style={{ fontSize: `${size}px`, lineHeight: 1 }}>
        🌍
      </span>
    );
  }

  const countryCode = countryToISO[country];

  if (!countryCode) {
    return (
      <span className={className} style={{ fontSize: `${size}px`, lineHeight: 1 }}>
        🌍
      </span>
    );
  }

  return (
    <Image src={`/flags/${countryCode}.svg`} alt={`${country} 국기`} width={size} height={size} className={className} />
  );
}
