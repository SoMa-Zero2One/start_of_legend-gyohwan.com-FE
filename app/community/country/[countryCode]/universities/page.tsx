import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

interface UniversitiesPageProps {
  params: Promise<{ countryCode: string }>;
}

// 서버 컴포넌트 - 해당 국가의 모든 대학 목록 페이지
export default async function UniversitiesPage({ params }: UniversitiesPageProps) {
  const { countryCode } = await params;

  return (
    <div className="flex min-h-screen flex-col">
      {/* Sticky Header */}
      <div className="sticky top-0 z-20 bg-white">
        <Header title={`${countryCode.toUpperCase()} 대학 목록`} showPrevButton showHomeButton />
      </div>

      <main className="mx-auto w-full max-w-[430px] flex-1 px-[20px] py-[24px]">
        <p className="text-gray-600">대학 전체 목록 페이지는 추후 구현될 예정입니다.</p>
      </main>

      <Footer />
    </div>
  );
}
