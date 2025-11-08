import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

interface TalksPageProps {
  params: Promise<{ countryCode: string }>;
}

// 서버 컴포넌트 - 국가별 커뮤니티 전체 목록 페이지
export default async function TalksPage({ params }: TalksPageProps) {
  const { countryCode } = await params;

  return (
    <div className="flex min-h-screen flex-col">
      {/* Sticky Header */}
      <div className="sticky top-0 z-20 bg-white">
        <Header title={`${countryCode.toUpperCase()} 커뮤니티`} showPrevButton showHomeButton />
      </div>

      <main className="mx-auto w-full max-w-[430px] flex-1 px-[20px] py-[24px]">
        <p className="text-gray-600">커뮤니티 전체 목록 페이지는 추후 구현될 예정입니다.</p>
      </main>

      <Footer />
    </div>
  );
}
