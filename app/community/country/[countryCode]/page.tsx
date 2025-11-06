import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import CountryDetailContent from "@/components/country/CountryDetailContent";
import { getCountryDetail } from "@/lib/api/country";

interface CountryDetailPageProps {
  params: Promise<{ countryCode: string }>;
}

// 서버 컴포넌트
export default async function CountryDetailPage({ params }: CountryDetailPageProps) {
  const { countryCode } = await params;

  // API 호출
  const countryData = await getCountryDetail(countryCode.toUpperCase());

  return (
    <div className="flex min-h-screen flex-col">
      {/* Sticky Header */}
      <div className="sticky top-0 z-20 bg-white">
        <Header showPrevButton />
      </div>

      <main className="mx-auto w-full max-w-[430px] flex-1">
        <CountryDetailContent countryData={countryData} />
      </main>

      <Footer />
    </div>
  );
}
