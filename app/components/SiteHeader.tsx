"use client";

import { useState, useEffect, CSSProperties } from "react";
import Image from "next/image";

const LIGHT_SECTIONS = ["03 KPI", "03b Team Reveal", "04 Work", "05 Clients", "06 Products", "07 Insights", "08 FAQ", "09 Footer"];

export default function SiteHeader({ forceLight = false, current = "" }: { forceLight?: boolean; current?: string }) {
  const [hidden, setHidden] = useState(false);
  const [light, setLight] = useState(forceLight);
  const [solid, setSolid] = useState(forceLight);
  const [toast, setToast] = useState(false);
  const [contactOpen, setContactOpen] = useState(false);

  const showSoon = () => { setToast(true); setTimeout(() => setToast(false), 1800); };

  useEffect(() => {
    const onOpen = () => setContactOpen(true);
    window.addEventListener("open-contact", onOpen);
    return () => window.removeEventListener("open-contact", onOpen);
  }, []);

  useEffect(() => {
    if (forceLight) { setLight(true); setSolid(true); }
    let lastY = window.scrollY;
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const y = window.scrollY;
        const delta = y - lastY;
        if (y < 80) setHidden(false);
        else if (delta > 6) setHidden(true);
        else if (delta < -6) setHidden(false);

        if (!forceLight) {
          setSolid(y > 40);
          const el = document.elementFromPoint(window.innerWidth / 2, 100);
          if (el) {
            const sec = el.closest("[data-screen-label]");
            if (sec) {
              const label = sec.getAttribute("data-screen-label") || "";
              setLight(LIGHT_SECTIONS.some((l) => label.startsWith(l)));
            }
          }
        }
        lastY = y;
        ticking = false;
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, [forceLight]);

  const navStyle: CSSProperties = {
    position: "fixed", top: 0, left: 0, right: 0,
    transform: `translateY(${hidden ? "-100%" : "0"})`,
    transition: "transform .35s cubic-bezier(.22,.61,.36,1), background .25s ease, border-color .25s ease, color .25s ease",
    height: 64, padding: "0 24px", zIndex: 50,
    background: solid ? (light ? "#ffffff" : "#0a0a0a") : "transparent",
    borderBottom: solid ? (light ? "1px solid rgba(10,10,10,.06)" : "1px solid rgba(255,255,255,.06)") : "1px solid transparent",
    color: light ? "#0a0a0a" : "#fff",
  };

  const itemStyle = (key: string): CSSProperties => ({
    cursor: "pointer", color: "inherit", textDecoration: "none",
    fontWeight: current === key ? 600 : 500,
    padding: "10px 16px", borderRadius: 8,
    transition: "background .2s ease, color .2s ease",
  });

  return (
    <>
      <nav style={navStyle}>
        <div style={{ maxWidth: 1200, margin: "0 auto", height: "100%", display: "flex", alignItems: "center" }}>
          {/* Logo */}
          <a href="/" style={{ height: 30, display: "block", flex: "0 0 auto", marginRight: 56, position: "relative", width: 190 }} aria-label="TOKTOKHAN.DEV">
            <Image src="/assets/tok-logo-white.svg" alt="" width={190} height={30} priority style={{ position: "absolute", top: 0, left: 0, height: 30, width: "auto", opacity: light ? 0 : 1, transition: "opacity .25s ease" }} />
            <Image src="/assets/tok-logo-black.svg" alt="" width={190} height={30} priority style={{ position: "absolute", top: 0, left: 0, height: 30, width: "auto", opacity: light ? 1 : 0, transition: "opacity .25s ease" }} />
          </a>

          {/* Nav links */}
          <div style={{ display: "flex", gap: 4, font: "500 15px/1 var(--font-sans)", color: light ? "rgba(10,10,10,.85)" : "rgba(255,255,255,.85)", transition: "color .25s ease" }}>
            <a href="/work" style={itemStyle("Work")}>Work</a>
            <a href="/insight" style={itemStyle("Insight")}>Insight</a>
            <a href="/faq" style={itemStyle("FAQ")}>FAQ</a>
          </div>

          {/* Right: CTA */}
          <div style={{ display: "flex", gap: 8, alignItems: "center", marginLeft: "auto" }}>
            <button
              style={{ font: "600 15px/1 var(--font-sans)", color: light ? "#fff" : "#0a0a0a", padding: "10px 14px", background: light ? "#0a0a0a" : "#fff", border: 0, borderRadius: 9, cursor: "pointer", transition: "all .25s ease" }}
              onClick={() => setContactOpen(true)}
            >
              문의하기
            </button>
          </div>
        </div>
      </nav>

      {/* Hover styles */}
      <style>{`
        nav a:not([aria-label]):hover { background: ${light ? "rgba(10,10,10,.06)" : "rgba(255,255,255,.10)"}; }
        @keyframes toastIn { from { opacity:0; transform:translate(-50%,-6px); } to { opacity:1; transform:translate(-50%,0); } }
        @keyframes modalFade { from { opacity:0; } to { opacity:1; } }
        @keyframes drawerSlide { from { transform:translateX(100%); } to { transform:translateX(0); } }
      `}</style>

      {/* Toast */}
      {toast && (
        <div style={{
          position: "fixed", top: 88, left: "50%", transform: "translateX(-50%)",
          background: "rgba(10,10,10,.9)", color: "#fff", padding: "10px 18px",
          borderRadius: 999, font: "500 13px/1 var(--font-sans)", zIndex: 60,
          backdropFilter: "blur(8px)", animation: "toastIn .25s ease-out",
          boxShadow: "0 6px 20px rgba(0,0,0,.25)",
        }}>준비중입니다</div>
      )}

      {/* Contact Drawer */}
      {contactOpen && (
        <div
          style={{ position: "fixed", inset: 0, background: "rgba(10,10,10,.6)", zIndex: 80, backdropFilter: "blur(8px)", WebkitBackdropFilter: "blur(8px)", animation: "modalFade .25s ease-out" }}
          onClick={() => setContactOpen(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{ position: "absolute", top: 0, right: 0, bottom: 0, width: "100%", maxWidth: 560, background: "#fff", boxShadow: "-24px 0 80px rgba(0,0,0,.3)", animation: "drawerSlide .35s cubic-bezier(.22,.61,.36,1)", display: "flex", flexDirection: "column", overflow: "hidden" }}
          >
            <button
              onClick={() => setContactOpen(false)}
              aria-label="닫기"
              style={{ position: "absolute", top: 16, right: 16, zIndex: 2, width: 36, height: 36, borderRadius: 999, background: "rgba(10,10,10,.06)", border: 0, color: "#0a0a0a", cursor: "pointer", font: "400 18px/1 var(--font-sans)", display: "inline-flex", alignItems: "center", justifyContent: "center" }}
            >✕</button>
            <iframe
              src="https://www.pluuug.com/form/w464pT1uRZ"
              style={{ flex: 1, width: "100%", border: "none", display: "block" }}
              title="문의하기"
            />
          </div>
        </div>
      )}
    </>
  );
}
