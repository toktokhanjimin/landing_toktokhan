"use client";

import { useEffect, useState, useRef } from "react";
import { getStickyConfig, type StickyConfig } from "../lib/store";

interface Props {
  variant?: "float" | "inline";
}

export default function StickyActionButton({ variant = "float" }: Props) {
  const [config, setConfig] = useState<StickyConfig | null>(null);
  const [visible, setVisible] = useState(false);
  const [formUrl, setFormUrl] = useState<string | null>(null);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const cfg = getStickyConfig();
    if (cfg.enabled && cfg.actions.length > 0) setConfig(cfg);
  }, []);

  // 플로팅: 스크롤 80px 넘으면 등장, 인라인 버튼 위치에 닿으면 숨김
  useEffect(() => {
    if (variant !== "float") return;
    const onScroll = () => {
      if (window.scrollY <= 80) { setVisible(false); return; }
      const anchor = document.getElementById("sticky-inline-anchor");
      if (anchor) {
        const rect = anchor.getBoundingClientRect();
        const floatTop = window.innerHeight - 32 - 50;
        setVisible(rect.top > floatTop);
      } else {
        setVisible(true);
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, [variant]);

  if (!config) return null;

  const isFloat = variant === "float";
  const isInline = variant === "inline";

  // 링크 액션 / 다운로드 액션 분리
  const linkAction = config.actions.find((a) => a.type === "link");
  const downloadAction = config.actions.find((a) => a.type === "download");

  return (
    <>
      <style>{`
        .sticky-float-bar {
          position: fixed;
          bottom: 28px;
          left: 50%;
          transform: translateX(-50%);
          transition: opacity .25s ease, transform .25s ease;
          z-index: 40;
          display: flex;
          align-items: center;
          gap: 0;
          background: var(--bg-dark);
          border-radius: 100px;
          padding: 8px 8px 8px 24px;
          box-shadow: 0 8px 40px rgba(0,0,0,.32), 0 2px 12px rgba(0,0,0,.2);
          white-space: nowrap;
        }
        ${isFloat ? `.sticky-float-bar { opacity: ${visible ? 1 : 0}; pointer-events: ${visible ? "auto" : "none"}; transform: translateX(-50%) translateY(${visible ? 0 : 6}px); }` : ""}
        .sticky-float-desc {
          font: 600 15px/1.4 var(--font-sans);
          color: var(--fg-on-dark-1);
          padding-right: 20px;
          letter-spacing: -.01em;
        }
        .sticky-float-sep {
          width: 1px;
          height: 24px;
          background: rgba(255,255,255,.18);
          flex-shrink: 0;
          margin: 0 6px;
        }
        .sticky-float-ghost {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 12px 18px;
          border-radius: 100px;
          background: rgba(255,255,255,.1);
          color: var(--fg-on-dark-1);
          font: 500 15px/1 var(--font-sans);
          border: none;
          cursor: pointer;
          text-decoration: none;
          transition: background .2s ease;
          white-space: nowrap;
        }
        .sticky-float-ghost:hover { background: rgba(255,255,255,.18); }
        .sticky-float-primary {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 12px 20px;
          border-radius: 100px;
          background: var(--btn-primary);
          color: var(--on-brand);
          font: 600 15px/1 var(--font-sans);
          border: none;
          cursor: pointer;
          text-decoration: none;
          transition: background .2s ease;
          white-space: nowrap;
        }
        .sticky-float-primary:hover { background: var(--primary-600, #0875df); }
        .sticky-float-chat {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 44px;
          height: 44px;
          border-radius: 100px;
          background: rgba(255,255,255,.12);
          color: var(--fg-on-dark-1);
          border: none;
          cursor: pointer;
          flex-shrink: 0;
          transition: background .2s ease;
        }
        .sticky-float-chat:hover { background: rgba(255,255,255,.2); }

        /* 인라인 (CTA 섹션) */
        .sticky-inline-bar {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: var(--bg);
          border: 1px solid rgba(10,10,10,.13);
          border-radius: var(--r-full);
          padding: 6px 6px 6px 18px;
          animation: inlineAppear .35s cubic-bezier(.22,.61,.36,1) both;
        }
        @keyframes inlineAppear {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .sticky-inline-label {
          font: 500 14px/1 var(--font-sans);
          color: var(--fg-1);
          padding-right: 4px;
        }
        .sticky-inline-btn {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 9px 16px;
          border-radius: var(--r-full);
          background: var(--btn-primary);
          color: var(--on-brand);
          font: 600 14px/1 var(--font-sans);
          border: none;
          cursor: pointer;
          text-decoration: none;
          transition: background .2s ease;
          white-space: nowrap;
        }
        .sticky-inline-btn:hover { background: var(--primary-600, #0875df); }

        @media (max-width: 640px) {
          .sticky-float-bar {
            bottom: 20px;
            padding: 7px 7px 7px 18px;
            max-width: calc(100vw - 32px);
          }
          .sticky-float-desc { display: none; }
          .sticky-float-ghost { padding: 11px 14px; font-size: 14px; }
          .sticky-float-primary { padding: 11px 16px; font-size: 14px; }
          .sticky-float-chat { width: 40px; height: 40px; }
        }

        @keyframes modalFade { from { opacity:0; } to { opacity:1; } }
        @keyframes drawerSlide { from { transform:translateX(100%); } to { transform:translateX(0); } }
      `}</style>

      {/* 플로팅 바 */}
      {isFloat && (
        <div className="sticky-float-bar" ref={ref}>
          {config.description && (
            <span className="sticky-float-desc" style={{ whiteSpace: "pre-line" }}>
              {config.description}
            </span>
          )}

          {linkAction && (
            <>
              <div className="sticky-float-sep" />
              <a
                className="sticky-float-ghost"
                href={linkAction.url || undefined}
                target={linkAction.url ? "_blank" : undefined}
                rel={linkAction.url ? "noopener noreferrer" : undefined}
              >
                {linkAction.label}
              </a>
            </>
          )}

          {downloadAction && (
            <>
              <div className="sticky-float-sep" />
              <button
                className="sticky-float-primary"
                onClick={() => downloadAction.url && setFormUrl(downloadAction.url)}
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
                </svg>
                {downloadAction.label}
              </button>
            </>
          )}

          <div className="sticky-float-sep" />
          <button
            className="sticky-float-chat"
            onClick={() => window.dispatchEvent(new CustomEvent("open-contact"))}
            aria-label="문의하기"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
            </svg>
          </button>
        </div>
      )}

      {/* 인라인 (CTA 섹션) */}
      {isInline && (
        <div id="sticky-inline-anchor" className="sticky-inline-bar">
          <span className="sticky-inline-label">{config.buttonLabel}</span>
          {downloadAction && (
            <button
              className="sticky-inline-btn"
              onClick={() => downloadAction.url && setFormUrl(downloadAction.url)}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
              </svg>
              {downloadAction.label}
            </button>
          )}
          {linkAction && (
            <a
              className="sticky-inline-btn"
              href={linkAction.url || undefined}
              target={linkAction.url ? "_blank" : undefined}
              rel={linkAction.url ? "noopener noreferrer" : undefined}
              style={{ background: "rgba(10,10,10,.08)", color: "var(--fg-1)" }}
            >
              {linkAction.label}
            </a>
          )}
        </div>
      )}

      {/* 다운로드 폼 드로어 */}
      {formUrl && (
        <div
          style={{ position: "fixed", inset: 0, background: "rgba(10,10,10,.6)", zIndex: 80, backdropFilter: "blur(8px)", WebkitBackdropFilter: "blur(8px)", animation: "modalFade .25s ease-out" }}
          onClick={() => setFormUrl(null)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{ position: "absolute", top: 0, right: 0, bottom: 0, width: "100%", maxWidth: 560, background: "var(--bg)", boxShadow: "-24px 0 80px rgba(0,0,0,.3)", animation: "drawerSlide .35s cubic-bezier(.22,.61,.36,1)", display: "flex", flexDirection: "column", overflow: "hidden" }}
          >
            <button
              onClick={() => setFormUrl(null)}
              style={{ position: "absolute", top: 16, right: 16, zIndex: 2, width: 36, height: 36, borderRadius: "var(--r-full)", background: "rgba(10,10,10,.06)", border: 0, color: "var(--fg-1)", cursor: "pointer", font: "400 18px/1 var(--font-sans)", display: "inline-flex", alignItems: "center", justifyContent: "center" }}
            >✕</button>
            <iframe src={formUrl} style={{ flex: 1, width: "100%", border: "none", display: "block" }} title="소개서 신청" />
          </div>
        </div>
      )}
    </>
  );
}
