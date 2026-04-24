import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "권용현 포트폴리오 | Problem Solving Growth Strategist",
  description: "도전과 함께 성장하는 문제 해결 기반 성장 전략가 권용현의 사이버 여정형 포트폴리오"
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}
