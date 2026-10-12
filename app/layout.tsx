import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "namecard-maker | 명함 제작기",
  description: "가로·세로 명함에 텍스트와 걱정인형을 담아보세요. 편집과 실시간 미리보기, 이미지 저장.",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className="antialiased">{children}</body>
    </html>
  );
}
