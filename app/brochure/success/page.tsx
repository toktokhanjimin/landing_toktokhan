"use client";

import { useRouter } from "next/navigation";

export default function BrochureSuccess() {
  const router = useRouter();

  return (
    <div style={{
      minHeight: "100vh",
      background: "#0a0a0a",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      padding: "40px 24px",
      textAlign: "center",
      fontFamily: "var(--font-sans, sans-serif)",
    }}>
      {/* 이메일 아이콘 */}
      <div style={{
        width: 80,
        height: 80,
        borderRadius: 24,
        background: "rgba(73,80,255,.15)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 32,
      }}>
        <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#4950ff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
          <polyline points="22,6 12,13 2,6"/>
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
        똑똑한개발자 AX 서비스 소개서가<br />발송되었어요.
      </h1>

      <p style={{
        fontSize: 16,
        fontWeight: 400,
        color: "rgba(255,255,255,.6)",
        margin: "0 0 48px",
        maxWidth: 400,
        lineHeight: 1.7,
      }}>
        입력하신 이메일로 소개서를 보내드렸습니다.<br />
        메일함을 확인해 주세요.
      </p>

      <button
        onClick={() => router.push("/")}
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 8,
          padding: "14px 28px",
          borderRadius: 12,
          background: "#4950ff",
          color: "#ffffff",
          fontSize: 15,
          fontWeight: 500,
          border: "none",
          cursor: "pointer",
        }}
      >
        메인으로 이동하기
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="5" y1="12" x2="19" y2="12"/>
          <polyline points="12 5 19 12 12 19"/>
        </svg>
      </button>
    </div>
  );
}
