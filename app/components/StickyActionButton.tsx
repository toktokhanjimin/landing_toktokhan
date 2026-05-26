"use client";

import { useEffect, useLayoutEffect, useState, useRef } from "react";
import { getStickyConfig, type StickyConfig } from "../lib/store";

interface Props {
  variant?: "float" | "inline";
}

export default function StickyActionButton({ variant = "float" }: Props) {
  const [config, setConfig] = useState<StickyConfig | null>(null);
  const [isDarkBg, setIsDarkBg] = useState(true);
  const [formUrl, setFormUrl] = useState<string | null>(null);
  const floatRef = useRef<HTMLDivElement>(null);
  const dockRef = useRef<HTMLDivElement>(null);
  const wasDockedRef = useRef(false);

  useEffect(() => {
    const cfg = getStickyConfig();
    if (cfg.enabled && cfg.actions.length > 0) setConfig(cfg);
  }, []);


  // 플로팅 바: ref로 직접 DOM 조작 → 프레임 지연 없음
  useEffect(() => {
    if (variant !== "float") return;
    const barCenterY = window.innerHeight - 28 - 39;

    const setFloat = (show: boolean, instant: boolean) => {
      const el = floatRef.current;
      if (!el) return;
      el.style.transition = instant
        ? "none"
        : "opacity .25s ease, transform .25s ease, background .3s ease, box-shadow .3s ease";
      el.style.opacity = show ? "1" : "0";
      el.style.pointerEvents = show ? "auto" : "none";
      el.style.transform = `translateX(-50%) translateY(${show ? 0 : 6}px)`;
    };

    const onScroll = () => {
      const scrollY = window.scrollY;

      if (scrollY <= 80) { setFloat(false, false); return; }

      const sentinel = document.getElementById("sticky-inline-anchor");
      const atDock = !!sentinel && sentinel.getBoundingClientRect().top <= window.innerHeight - 28;
      // 도킹 진입/해제 모두 instant — 어느 쪽이든 전환 순간엔 transition 없음
      const instant = atDock || wasDockedRef.current;
      wasDockedRef.current = atDock;
      setFloat(!atDock, instant);

      // WhyToktok 섹션 기준 테마 전환 (state는 테마만)
      const whySection = document.querySelector('[data-screen-label="02b Why Toktok"]');
      if (whySection) {
        setIsDarkBg(whySection.getBoundingClientRect().bottom > barCenterY);
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, [variant]);

  // 인라인 바 초기값: JSX style이 아닌 ref로 설정 — 리렌더 시 React가 덮어쓰지 않음
  useLayoutEffect(() => {
    if (variant !== "inline" || !dockRef.current) return;
    dockRef.current.style.opacity = "0";
    dockRef.current.style.pointerEvents = "none";
    dockRef.current.style.transition = "none";
  });

  // 인라인 바: ref로 직접 DOM 조작
  useEffect(() => {
    if (variant !== "inline") return;

    const setDock = (docked: boolean) => {
      const el = dockRef.current;
      if (!el) return;
      el.style.transition = "none";
      el.style.opacity = docked ? "1" : "0";
      el.style.pointerEvents = docked ? "auto" : "none";
    };

    const onScroll = () => {
      const sentinel = document.getElementById("sticky-inline-anchor");
      if (!sentinel) return;
      setDock(sentinel.getBoundingClientRect().top <= window.innerHeight - 28);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, [variant]);

  if (!config) return null;

  const isFloat = variant === "float";
  const isInline = variant === "inline";

  const linkAction = config.actions.find((a) => a.type === "link");
  const downloadAction = config.actions.find((a) => a.type === "download");

  const buttons = (
    <>
      {linkAction && (
        <a
          className="sticky-float-ghost"
          href={linkAction.url || undefined}
          target={linkAction.url ? "_blank" : undefined}
          rel={linkAction.url ? "noopener noreferrer" : undefined}
          style={{ marginLeft: 16 }}
        >
          {linkAction.label}
        </a>
      )}
      {linkAction && downloadAction && <div className="sticky-float-sep" />}
      {downloadAction && (
        <a
          className="sticky-float-primary"
          href="https://www.pluuug.com/form/pbrPZzeYyu"
          target="_blank"
          rel="noopener noreferrer"
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
          </svg>
          {downloadAction.label}
        </a>
      )}
      <button
        className="sticky-float-chat"
        style={{ marginLeft: 8 }}
        onClick={() => document.getElementById("contact-cta")?.scrollIntoView({ behavior: "smooth" })}
        aria-label="문의하기"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
        </svg>
      </button>
    </>
  );

  return (
    <>
      <style>{`
        .sticky-float-bar {
          position: fixed;
          bottom: 28px;
          left: 50%;
          transform: translateX(-50%) translateY(6px);
          opacity: 0;
          pointer-events: none;
          z-index: 40;
          display: flex;
          align-items: center;
          gap: 0;
          border-radius: var(--r-xl);
          padding: 20px 20px 20px 28px;
          white-space: nowrap;
        }
        .sticky-float-bar[data-theme="light"] {
          background: #fff;
          box-shadow: 0 8px 40px rgba(0,0,0,.14), 0 2px 12px rgba(0,0,0,.08);
        }
        .sticky-float-bar[data-theme="dark"] {
          background: var(--bg-dark);
          box-shadow: 0 8px 40px rgba(0,0,0,.32), 0 2px 12px rgba(0,0,0,.2);
        }

        /* 설명 텍스트 */
        .sticky-float-bar[data-theme="dark"] .sticky-float-desc,
        .sticky-inline-bar .sticky-float-desc { color: var(--fg-on-dark-1); }
        .sticky-float-bar[data-theme="light"] .sticky-float-desc { color: var(--fg-1); }
        .sticky-float-desc {
          font: 600 15px/1.4 var(--font-sans);
          padding-right: 20px;
          letter-spacing: -.01em;
          transition: color .3s ease;
          text-align: left;
        }

        /* 구분선 */
        .sticky-float-bar[data-theme="dark"] .sticky-float-sep,
        .sticky-inline-bar .sticky-float-sep { background: rgba(255,255,255,.18); }
        .sticky-float-bar[data-theme="light"] .sticky-float-sep { background: rgba(0,0,0,.12); }
        .sticky-float-sep {
          width: 1px; height: 24px; flex-shrink: 0;
          margin: 0 6px;
          transition: background .3s ease;
        }

        /* ghost 버튼 */
        .sticky-float-bar[data-theme="dark"] .sticky-float-ghost,
        .sticky-inline-bar .sticky-float-ghost { background: rgba(255,255,255,.2); color: var(--fg-on-dark-1); }
        .sticky-float-bar[data-theme="dark"] .sticky-float-ghost:hover,
        .sticky-inline-bar .sticky-float-ghost:hover { background: rgba(255,255,255,.28); }
        .sticky-float-bar[data-theme="light"] .sticky-float-ghost { background: rgba(0,0,0,.1); color: var(--fg-1); }
        .sticky-float-bar[data-theme="light"] .sticky-float-ghost:hover { background: rgba(0,0,0,.15); }
        .sticky-float-ghost {
          display: inline-flex; align-items: center; gap: 6px;
          padding: 12px 18px; border-radius: var(--r-md);
          font: 500 14px/1 var(--font-sans);
          border: none; cursor: pointer; text-decoration: none;
          transition: background .2s ease, color .3s ease;
          white-space: nowrap;
        }

        /* primary 버튼 */
        .sticky-float-primary {
          display: inline-flex; align-items: center; gap: 8px;
          padding: 12px 18px; border-radius: var(--r-md);
          background: var(--btn-primary); color: var(--on-brand);
          font: 500 14px/1 var(--font-sans);
          border: none; cursor: pointer; text-decoration: none;
          transition: background .2s ease; white-space: nowrap;
        }
        .sticky-float-primary:hover { background: var(--primary-600); }

        /* 문의 아이콘 버튼 */
        .sticky-float-chat {
          display: inline-flex; align-items: center; justify-content: center;
          width: 38px; height: 38px; border-radius: var(--r-md);
          background: var(--btn-primary); color: var(--on-brand);
          border: none; cursor: pointer; flex-shrink: 0;
          transition: background .2s ease;
        }
        .sticky-float-chat:hover { background: var(--primary-600); }

        /* 인라인 도킹 바 */
        .sticky-inline-bar {
          display: inline-flex; align-items: center; gap: 0;
          background: var(--bg-dark);
          border-radius: var(--r-xl);
          padding: 20px 20px 20px 28px;
          box-shadow: 0 8px 40px rgba(0,0,0,.32), 0 2px 12px rgba(0,0,0,.2);
          white-space: nowrap;
        }

        @media (max-width: 640px) {
          .sticky-float-bar { bottom: 20px; padding: 7px 7px 7px 18px; max-width: calc(100vw - 32px); }
          .sticky-float-desc { display: none; }
          .sticky-float-ghost { padding: 10px 14px; font-size: 13px; }
          .sticky-float-primary { padding: 10px 14px; font-size: 13px; }
          .sticky-float-chat { width: 34px; height: 34px; }
          .sticky-inline-dock { bottom: 20px !important; }
        }

        @keyframes modalFade { from { opacity:0; } to { opacity:1; } }
        @keyframes drawerSlide { from { transform:translateX(100%); } to { transform:translateX(0); } }
      `}</style>

      {/* 플로팅 바 */}
      {isFloat && (
        <div
          className="sticky-float-bar"
          data-theme={isDarkBg ? "light" : "dark"}
          ref={floatRef}
        >
          {config.description && (
            <span className="sticky-float-desc" style={{ whiteSpace: "pre-line" }}>
              {config.description}
            </span>
          )}
          {buttons}
        </div>
      )}

      {/* 인라인 도킹 바 — FAQ 섹션 내 */}
      {isInline && (
        <>
          <div id="sticky-inline-anchor" style={{ height: 0 }} />
          <div
            ref={dockRef}
            className="sticky-inline-dock"
            style={{
              position: "sticky",
              bottom: 28,
              display: "flex",
              justifyContent: "center",
              zIndex: 40,
            }}
          >
            <div className="sticky-inline-bar">
              {config.description && (
                <span className="sticky-float-desc" style={{ whiteSpace: "pre-line" }}>
                  {config.description}
                </span>
              )}
              {buttons}
            </div>
          </div>
        </>
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
