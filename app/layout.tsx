import type { Metadata } from "next";
import { IBM_Plex_Mono } from "next/font/google";
import "./globals.css";

const ibmPlexMono = IBM_Plex_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "TOKTOKHAN.DEV — Build AI · Enable AI Organizations",
  description: "AI를 도입하는 게 아니라, 일하는 방식을 다시 짭니다. 똑똑한개발자는 사람과 AI가 함께 일하는 조직을 만들어요.",
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
