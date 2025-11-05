import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

interface UniversityDetailPageProps {
  params: Promise<{ univId: string }>;
}

// 서버 컴포넌트
export default async function UniversityDetailPage({ params }: UniversityDetailPageProps) {
  const { univId } = await params;

  return (
    <>
      <Header title="대학 상세" showPrevButton showHomeButton />
      <main className="mx-auto w-full max-w-[430px] px-[20px] py-[24px]">
        <h1 className="heading-3 mb-[16px]">대학 ID: {univId}</h1>
        <p className="body-2 text-gray-600">대학 상세 페이지 내용이 들어갈 예정입니다.</p>
      </main>
      <Footer />
    </>
  );
}
