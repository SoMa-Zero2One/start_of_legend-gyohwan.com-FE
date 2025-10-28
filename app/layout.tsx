import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";
import { MSWProvider } from "@/components/providers/MSWProvider";

export const metadata: Metadata = {
  title: "교환닷컴",
  description: "함께하는 길잡이-교환닷컴(준비부터 파견까지, 교환학생이 쉬워지는 동행)",
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
        <Script
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-9DDXNVVM0V"
          strategy="afterInteractive"
        />
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
