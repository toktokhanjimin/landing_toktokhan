"use client";

import { useEffect, useState, useRef } from "react";
import { getStickyConfig, type StickyConfig } from "../lib/store";

export default function StickyActionButton() {
  const [config, setConfig] = useState<StickyConfig | null>(null);
  const [visible, setVisible] = useState(false);
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const cfg = getStickyConfig();
    if (cfg.enabled && cfg.actions.length > 0) setConfig(cfg);
  }, []);

  // 스크롤 80px 넘으면 등장
  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 80);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // 외부 클릭 시 닫기
  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  if (!config) return null;

  return (
    <>
      <style>{`
        .sticky-btn-wrap {
          position: fixed;
          bottom: 32px;
          left: 50%;
          transform: translateX(-50%) translateY(${visible ? "0" : "100px"});
          opacity: ${visible ? 1 : 0};
          transition: transform .4s cubic-bezier(.22,.61,.36,1), opacity .3s ease;
          z-index: 40;
          display: flex;
          flex-direction: column;
          align-items: stretch;
          gap: 10px;
          width: max-content;
          max-width: calc(100vw - 32px);
        }
        @media (max-width: 640px) {
          .sticky-btn-wrap {
            bottom: 20px;
          }
          .sticky-trigger {
            padding: 14px 14px;
          }
          .sticky-action-item {
            padding: 15px 14px;
            font-size: 14px;
          }
        }
        .sticky-menu {
          background: var(--bg);
          border-radius: var(--r-xl);
          box-shadow: 0 8px 40px rgba(0,0,0,.14), 0 1px 4px rgba(0,0,0,.06);
          overflow: hidden;
          transform-origin: bottom center;
          animation: stickyMenuIn .22s cubic-bezier(.22,.61,.36,1);
        }
        @keyframes stickyMenuIn {
          from { opacity: 0; transform: scale(.95) translateY(8px); }
          to   { opacity: 1; transform: scale(1) translateY(0); }
        }
        .sticky-action-item {
          display: block;
          padding: 16px 14px;
          font: 500 15px/1 var(--font-sans);
          color: var(--fg-1);
          text-decoration: none;
          white-space: nowrap;
          cursor: pointer;
          background: transparent;
          border: none;
          text-align: center;
          transition: background .15s ease;
        }
        .sticky-action-item:not(:last-child) {
          border-bottom: 1px solid rgba(10,10,10,.07);
        }
        .sticky-action-item:hover { background: rgba(10,10,10,.04); }
        .sticky-trigger {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 14px 24px;
          border-radius: var(--r-full);
          background: var(--btn-primary, #0a86f8);
          color: var(--on-brand);
          font: 600 15px/1 var(--font-sans);
          border: none;
          cursor: pointer;
          box-shadow: 0 4px 20px rgba(10,134,248,.35);
          white-space: nowrap;
          transition: background .2s ease, box-shadow .2s ease, transform .2s ease;
        }
        .sticky-trigger:hover {
          background: var(--primary-600, #0875df);
          box-shadow: 0 6px 28px rgba(10,134,248,.45);
          transform: translateY(-1px);
        }
        .sticky-chevron {
          transition: transform .25s ease;
          display: inline-flex;
        }
      `}</style>

      <div className="sticky-btn-wrap" ref={ref}>
        {open && (
          <div className="sticky-menu">
            {config.actions.map((action, i) => {
              if (!action.label) return null;
              if (action.type === "download" && action.url) {
                return (
                  <a key={i} className="sticky-action-item" href={action.url} download={action.fileName || true}>
                    ↓ {action.label}
                  </a>
                );
              }
              return (
                <a
                  key={i}
                  className="sticky-action-item"
                  href={action.url || undefined}
                  target={action.url ? "_blank" : undefined}
                  rel={action.url ? "noopener noreferrer" : undefined}
                  onClick={() => setOpen(false)}
                >
                  {action.label} {action.url ? "→" : ""}
                </a>
              );
            })}
          </div>
        )}

        <button className="sticky-trigger" onClick={() => setOpen((v) => !v)}>
          {config.buttonLabel}
          <span className="sticky-chevron" style={{ transform: open ? "rotate(180deg)" : "rotate(0deg)" }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 9l6 6 6-6" />
            </svg>
          </span>
        </button>
      </div>
    </>
  );
}
