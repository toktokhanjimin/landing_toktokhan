"use client";

import { useEffect, useRef, useState } from "react";
import Button from "./ui/Button";

export default function WorkContactPopup() {
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (dismissed) return;

    // 관련 인사이트 섹션이 뷰포트에 들어오면 팝업 표시
    const target = document.querySelector("#work-related-insights");
    if (!target) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setVisible(true);
      },
      { threshold: 0 }
    );

    observer.observe(target);
    return () => observer.disconnect();
  }, [dismissed]);

  if (!visible || dismissed) return null;

  return (
    <>
      <style>{`
        @keyframes popupSlideIn {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .work-contact-popup {
          position: fixed;
          bottom: 32px;
          right: 32px;
          z-index: 60;
          width: 280px;
          background: #fff;
          border-radius: 16px;
          box-shadow: 0 12px 48px rgba(0,0,0,.18), 0 2px 12px rgba(0,0,0,.08);
          padding: 14px 24px 24px;
          animation: popupSlideIn .35s cubic-bezier(.22,.61,.36,1) forwards;
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
        @media (max-width: 767px) {
          .work-contact-popup {
            bottom: 84px;
            right: 16px;
            left: 16px;
            width: auto;
          }
        }
      `}</style>

      <div className="work-contact-popup" role="complementary" aria-label="프로젝트 문의">
        {/* GIF + 닫기 버튼 같은 행 */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{
            width: 60,
            height: 60,
            borderRadius: "var(--r-md)",
            overflow: "hidden",
            flexShrink: 0,
          }}>
            <img src="/TOK.gif" alt="" width={60} height={60} style={{ width: 60, height: 60, objectFit: "cover", display: "block" }} />
          </div>
          <button
            onClick={() => { setDismissed(true); setVisible(false); }}
            aria-label="닫기"
            style={{
              width: 28,
              height: 28,
              borderRadius: "50%",
              background: "rgba(10,10,10,.06)",
              border: 0,
              cursor: "pointer",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              color: "rgba(10,10,10,.5)",
              fontSize: 14,
              lineHeight: 1,
              flexShrink: 0,
            }}
          >
            ✕
          </button>
        </div>

        {/* 텍스트 */}
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          <p style={{ font: "700 15px/1.3 var(--font-sans)", color: "var(--fg-1)", margin: 0, letterSpacing: "-.01em" }}>
            연관 프로젝트를 문의하시겠어요?
          </p>
          <p style={{ font: "400 13px/1.5 var(--font-sans)", color: "rgba(10,10,10,.55)", margin: 0 }}>
            비슷한 문제, 저희가 함께 풀 수 있어요.
          </p>
        </div>

        {/* CTA */}
        <Button variant="primary" size="md" href="/contact" style={{ justifyContent: "center" }}>
          문의하기
        </Button>
      </div>
    </>
  );
}
