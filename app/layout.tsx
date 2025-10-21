import type { Metadata } from "next";
import "./globals.css";

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
      <body className="body-3 m-auto max-w-[430px] antialiased">
        <div className="flex flex-col">{children}</div>
      </body>
    </html>
  );
}
