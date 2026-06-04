"use client";

import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { trackEvent } from "../lib/gtag";

export default function ContactModal() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const [loaded, setLoaded] = useState(false);
  const [mounted, setMounted] = useState(false);
  const wasOpenRef = useRef(false);

  const contact = searchParams.get("contact");
  const isOpen = contact === "true";
  const isSubmitted = contact === "submitted";
  const from = searchParams.get("from") ?? "unknown";
  const [countdown, setCountdown] = useState(10);

  // 열림/닫힘 추적
  useEffect(() => {
    if (isOpen) {
      wasOpenRef.current = true;
      setLoaded(false);
      requestAnimationFrame(() => setMounted(true));
      trackEvent("contact_open", { source: from });
      document.body.style.overflow = "hidden";
    } else if (isSubmitted) {
      // 제출 완료 → 이탈이 아닌 전환
      wasOpenRef.current = false;
      trackEvent("contact_submit", { source: from });
      document.body.style.overflow = "hidden";
      requestAnimationFrame(() => setMounted(true));
    } else {
      if (wasOpenRef.current) {
        trackEvent("contact_close", { source: from });
        wasOpenRef.current = false;
      }
      setMounted(false);
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [isOpen, isSubmitted, from]);

  function close() {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("contact");
    params.delete("from");
    const qs = params.toString();
    router.push(qs ? `${pathname}?${qs}` : pathname);
  }

  // ESC 키로 닫기
  useEffect(() => {
    if (!isOpen && !isSubmitted) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") close(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen, isSubmitted]);

  if (!isOpen && !isSubmitted) return null;

  return (
    <div
      style={{
        position: "fixed", inset: 0, zIndex: 9999,
        background: `rgba(0,0,0,${mounted ? ".55" : "0"})`,
        transition: "background .25s ease",
        display: "flex", alignItems: "stretch",
      }}
      onClick={(e) => { if (e.target === e.currentTarget) close(); }}
    >
      <div
        style={{
          position: "relative", flex: 1, background: "#fff",
          transform: mounted ? "translateY(0)" : "translateY(12px)",
          opacity: mounted ? 1 : 0,
          transition: "transform .3s cubic-bezier(.2,.6,.2,1), opacity .25s ease",
        }}
      >
        {/* 닫기 버튼 */}
        <button
          onClick={close}
          aria-label="닫기"
          style={{
            position: "absolute", top: 16, right: 16, zIndex: 10,
            width: 40, height: 40, borderRadius: "50%",
            background: "rgba(10,10,10,.06)", border: "none",
            cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
            transition: "background .2s ease",
          }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "rgba(10,10,10,.12)"; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "rgba(10,10,10,.06)"; }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        {/* 제출 완료 화면 */}
        {isSubmitted ? (
          <div style={{
            position: "absolute", inset: 0,
            display: "flex", flexDirection: "column",
            alignItems: "center", justifyContent: "center",
            gap: 24, padding: "40px 24px", textAlign: "center",
          }}>
            <div style={{
              width: 64, height: 64, borderRadius: 20,
              background: "rgba(73,80,255,.1)",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--primary-500)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 12, maxWidth: 400 }}>
              <p style={{ font: "700 22px/1.3 var(--font-sans)", color: "#0a0a0a", margin: 0 }}>
                문의가 접수됐어요
              </p>
              <p style={{ font: "400 15px/1.6 var(--font-sans)", color: "rgba(10,10,10,.55)", margin: 0 }}>
                빠른 시간 내에 연락드릴게요.
              </p>
            </div>
            <button
              onClick={close}
              style={{
                font: "500 15px/1 var(--font-sans)", color: "#fff",
                background: "#0a0a0a", padding: "14px 32px",
                borderRadius: "var(--r-full)", border: "none",
                cursor: "pointer",
              }}
            >
              홈으로 돌아가기
            </button>
          </div>
        ) : (
          <>
            {/* 로딩 */}
            {!loaded && (
              <div style={{
                position: "absolute", top: "50%", left: "50%",
                transform: "translate(-50%, -50%)",
                display: "flex", flexDirection: "column", alignItems: "center", gap: 16,
              }}>
                <div style={{
                  width: 28, height: 28, borderRadius: "50%",
                  border: "2.5px solid rgba(10,10,10,.1)",
                  borderTopColor: "#0a0a0a",
                  animation: "spin .7s linear infinite",
                }} />
                <span style={{ font: "400 13px/1 var(--font-sans)", color: "rgba(10,10,10,.4)" }}>
                  불러오는 중...
                </span>
              </div>
            )}

            {/* Pluuug iframe */}
            <iframe
              src="https://www.pluuug.com/form/w464pT1uRZ"
              title="문의하기"
              onLoad={() => {
                setLoaded(true);
                trackEvent("contact_form_load", { source: from });
              }}
              style={{
                position: "absolute", inset: 0,
                width: "100%", height: "100%",
                border: "none",
                opacity: loaded ? 1 : 0,
                transition: "opacity .3s ease",
              }}
            />
          </>
        )}
      </div>
    </div>
  );
}
