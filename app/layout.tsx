import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";
import { MSWProvider } from "@/components/providers/MSWProvider";

// 환경에 따른 사이트 URL 결정
function getSiteUrl(): string {
  // 1. 명시적 환경변수 (최우선)
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    return process.env.NEXT_PUBLIC_SITE_URL;
  }

  // 2. Vercel 배포 환경
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }

  // 3. 로컬 개발 환경 fallback
  if (process.env.NODE_ENV === 'development') {
    return 'http://localhost:3000';
  }

  // 4. 최종 fallback (프로덕션)
  return 'https://gyohwan.com';
}

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
        url: `${siteUrl}/images/mainPage-1.png`,
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
    images: [`${siteUrl}/images/mainPage-1.png`],
  },
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#056DFF" },
    { media: "(prefers-color-scheme: dark)", color: "#1a1a1a" },
  ],
  viewport: {
    width: "device-width",
    initialScale: 1,
  },
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
    icon: [
      { url: "/logos/logo-blue.svg", media: "(prefers-color-scheme: light)" },
      { url: "/logos/logo-dark.svg", media: "(prefers-color-scheme: dark)" },
    ],
    apple: [
      { url: "/logos/logo-blue.svg", media: "(prefers-color-scheme: light)" },
      { url: "/logos/logo-dark.svg", media: "(prefers-color-scheme: dark)" },
    ],
  },
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
        <MSWProvider>
          <div className="flex flex-col">{children}</div>
        </MSWProvider>
      </body>
    </html>
  );
}
