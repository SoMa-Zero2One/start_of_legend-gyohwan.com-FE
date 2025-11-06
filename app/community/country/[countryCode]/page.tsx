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
    <>
      <Header showPrevButton />
      <main className="mx-auto w-full max-w-[430px]">
        <CountryDetailContent countryData={countryData} />
      </main>
      <Footer />
    </>
  );
}
