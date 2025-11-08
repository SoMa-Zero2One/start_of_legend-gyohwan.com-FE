import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

interface PostDetailPageProps {
  params: Promise<{ postId: string }>;
}

// 서버 컴포넌트 - 게시글 상세 페이지
export default async function PostDetailPage({ params }: PostDetailPageProps) {
  const { postId } = await params;

  return (
    <div className="flex min-h-screen flex-col">
      {/* Sticky Header */}
      <div className="sticky top-0 z-20 bg-white">
        <Header title="게시글" showPrevButton showHomeButton />
      </div>

      <main className="mx-auto w-full max-w-[430px] flex-1 px-[20px] py-[24px]">
        <p className="text-gray-600">게시글 상세 페이지는 추후 구현될 예정입니다. (Post ID: {postId})</p>
      </main>

      <Footer />
    </div>
  );
}
