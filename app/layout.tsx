import type { Metadata, Viewport } from "next";
import Script from "next/script";
import "./globals.css";
import { MSWProvider } from "@/components/providers/MSWProvider";
import { SentryProvider } from "@/components/providers/SentryProvider";
import { getSiteUrl } from "@/lib/utils/siteUrl";

const siteUrl = getSiteUrl();

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "교환닷컴 - 교환학생 정보 공유 플랫폼 (준비부터 파견까지)",
  description:
    "서로 정보를 공유하며 교환학생 준비를 함께 하세요. 실시간 지원 현황, GPA·어학성적 비교, 파견교 특징, 학생 비자 준비 - 교환닷컴에서 시작하세요.",
  keywords: ["교환학생", "교환학생 정보 공유", "교환 프로그램", "어학 성적", "학생 비자"],
  openGraph: {
    type: "website",
    locale: "ko_KR",
    url: siteUrl,
    siteName: "교환닷컴",
    title: "교환닷컴 - 함께하는 길잡이",
    description:
      "교환학생 준비부터 파견까지, 서로 정보를 공유하며 함께 준비하세요. 실시간 지원 현황과 성적 비교로 합격 가능성을 높이세요!",
    images: [
      {
        url: `${siteUrl}/images/og-image.png`,
        width: 1170,
        height: 1080,
        alt: "교환닷컴 - 교환학생 정보 공유 플랫폼",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "교환닷컴 - 함께하는 길잡이",
    description: "교환학생 준비부터 파견까지, 함께하는 길잡이",
    images: [`${siteUrl}/images/og-image.png`],
  },
  // Warning: Next.js 15 metadata 경고 해결
  // themeColor와 viewport는 metadata가 아닌 별도 viewport export로 분리됨
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    // 다크모드 지원 제거 - light 버전 아이콘만 사용
    icon: "/favicon.svg",
    apple: "/favicon.svg",
  },
};

// Warning: Next.js 15 metadata 경고 해결
// viewport와 themeColor는 별도 viewport export로 분리 (Next.js 15+)
// 참고: https://nextjs.org/docs/app/api-reference/functions/generate-viewport
// 다크모드 설정 제거 (프로젝트에서 사용하지 않음)
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#056DFF",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const gaId = process.env.NEXT_PUBLIC_GA_ID;

  return (
    <html lang="ko">
      <head>
        {gaId && (
          <>
            <link rel="preconnect" href="https://www.googletagmanager.com" />
            <Script async src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`} strategy="afterInteractive" />
            <Script id="google-analytics" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${gaId}');
              `}
            </Script>
          </>
        )}
      </head>
      <body className="body-3 m-auto max-w-[430px] bg-white antialiased">
        <SentryProvider>
          <MSWProvider>
            <div className="flex flex-col">{children}</div>
          </MSWProvider>
        </SentryProvider>
      </body>
    </html>
  );
}
