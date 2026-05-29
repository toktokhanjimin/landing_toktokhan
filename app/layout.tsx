import type { Metadata } from "next";
import { IBM_Plex_Mono } from "next/font/google";
import "./globals.css";

const ibmPlexMono = IBM_Plex_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.toktokhan.dev"),
  title: {
    default: "똑똑한개발자 | 기업 AX 전환 전문 개발사",
    template: "%s | 똑똑한개발자",
  },
  description:
    "제미나이, GPT, 클로드를 활용해 AI Agent 탑재 및 AX 전환의 전문성을 갖춘 IT 프러덕트 에이전시. 복잡한 업무 흐름과 기존 시스템을 이해하고, AI가 실제 업무 안에서 작동하도록 전략·개발·운영까지 함께 설계합니다.",
  keywords: [
    "AX", "AI 도입", "업무 자동화", "AI 에이전트", "AX 컨설팅",
    "똑똑한개발자", "기업 AI 전환", "제미나이", "GPT", "클로드", "AI Agent",
    "IT 프러덕트 에이전시",
  ],
  openGraph: {
    title: "똑똑한개발자 | 기업 AX 전환 전문 개발사",
    description:
      "제미나이, GPT, 클로드를 활용해 AI Agent 탑재 및 AX 전환의 전문성을 갖춘 IT 프러덕트 에이전시.",
    images: [{ url: "/OG.png", width: 1200, height: 630, alt: "똑똑한개발자" }],
    siteName: "똑똑한개발자",
    locale: "ko_KR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "똑똑한개발자 | 기업 AX 전환 전문 개발사",
    description:
      "제미나이, GPT, 클로드를 활용해 AI Agent 탑재 및 AX 전환의 전문성을 갖춘 IT 프러덕트 에이전시.",
    images: ["/OG.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className={ibmPlexMono.variable}>
      <body>{children}</body>
    </html>
  );
}
