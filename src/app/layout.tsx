import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "카톡 조작기",
  description: "가짜 카카오톡 대화를 만들고 저장하는 장난용 도구",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="ko" className="h-full">
      <body className="min-h-full flex flex-col bg-[#f2f2f2] text-[#1a1a1a]">
        {children}
      </body>
    </html>
  );
}
