import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";
import { MSWProvider } from "@/components/providers/MSWProvider";

export const metadata: Metadata = {
  title: "교환닷컴 - 교환학생 정보 공유 플랫폼 (준비부터 파견까지)",
  description:
    "서로 정보를 공유하며 교환학생 준비를 함께 하세요. 실시간 지원 현황, GPA·어학성적 비교, 파견교 특징, 학생 비자 준비 - 교환닷컴에서 시작하세요.",
  keywords: [
    "교환학생",
    "교환학생 지원",
    "교환학생 정보 공유",
    "파견",
    "교환 프로그램",
    "어학 성적",
    "학생 비자",
    "학생 비자 준비",
  ],
  openGraph: {
    type: "website",
    locale: "ko_KR",
    url: "https://gyohwan.com",
    siteName: "교환닷컴",
    title: "교환닷컴 - 함께하는 길잡이",
    description:
      "교환학생 준비부터 파견까지, 서로 정보를 공유하며 함께 준비하세요. 실시간 지원 현황과 성적 비교로 합격 가능성을 높이세요!",
    images: [
      {
        url: "https://gyohwan.com/images/mainPage-1.png",
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
    images: ["https://gyohwan.com/images/mainPage-1.png"],
  },
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
  return (
    <html lang="ko">
      <head>
        <Script async src="https://www.googletagmanager.com/gtag/js?id=G-9DDXNVVM0V" strategy="afterInteractive" />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-9DDXNVVM0V');
          `}
        </Script>
      </head>
      <body className="body-3 m-auto max-w-[430px] bg-white antialiased">
        <MSWProvider>
          <div className="flex flex-col">{children}</div>
        </MSWProvider>
      </body>
    </html>
  );
}
