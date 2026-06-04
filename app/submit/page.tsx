"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function SubmitPage() {
  const router = useRouter();
  const [countdown, setCountdown] = useState(10);

  useEffect(() => {
    const interval = setInterval(() => {
      setCountdown((c) => {
        if (c <= 1) {
          clearInterval(interval);
          router.push("/");
          return 0;
        }
        return c - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{
      minHeight: "100dvh",
      background: "var(--bg-dark)",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      padding: "40px 24px",
      textAlign: "center",
      fontFamily: "var(--font-sans, sans-serif)",
    }}>
      {/* 아이콘 */}
      <div style={{
        width: 80, height: 80,
        borderRadius: 24,
        background: "rgba(73,80,255,.15)",
        display: "flex", alignItems: "center", justifyContent: "center",
        marginBottom: 32,
      }}>
        <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="var(--primary-500)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="20 6 9 17 4 12" />
        </svg>
      </div>

      <h1 style={{
        fontSize: "clamp(24px, 3vw, 36px)",
        fontWeight: 700,
        color: "#ffffff",
        margin: "0 0 16px",
        letterSpacing: "-0.02em",
        lineHeight: 1.3,
      }}>
        문의가 접수됐어요.
      </h1>

      <p style={{
        fontSize: 16,
        color: "rgba(255,255,255,.6)",
        margin: "0 0 48px",
        maxWidth: 400,
        lineHeight: 1.7,
      }}>
        빠른 시간 내에 연락드릴게요.<br />
        {countdown}초 후 자동으로 메인 페이지로 이동합니다.
      </p>

      <button
        onClick={() => router.push("/")}
        style={{
          display: "inline-flex", alignItems: "center", gap: 8,
          padding: "14px 28px",
          borderRadius: "var(--r-full)",
          background: "var(--primary-500)",
          color: "#fff",
          font: "500 15px/1 var(--font-sans, sans-serif)",
          border: "none",
          cursor: "pointer",
        }}
      >
        메인으로 이동하기 →
      </button>
    </div>
  );
}
