"use client";

import { useState, useEffect, type CSSProperties } from "react";
import SiteHeader from "../components/SiteHeader";
import Footer from "../components/Footer";
import { getFAQs, type FAQItem } from "../lib/store";


export default function FAQPage() {
  const [open, setOpen] = useState<number>(0);
  const [items, setItems] = useState<FAQItem[]>([]);

  useEffect(() => {
    setItems(getFAQs());
    const prev = document.body.style.background;
    document.body.style.background = "#ffffff";
    return () => { document.body.style.background = prev; };
  }, []);

  return (
    <div style={{ background: "var(--bg)", color: "var(--fg-1)", minHeight: "100dvh" }}>
      <SiteHeader forceLight current="FAQ" />

      {/* Hero */}
      <header className="page-hero-header" style={{
        padding: "180px 24px 80px",
        maxWidth: 1248,
        margin: "0 auto",
        display: "flex",
        flexDirection: "column",
        gap: 24,
      }}>
        <h1 style={{
          font: "700 clamp(32px,4.4vw,60px)/1.24 var(--font-sans)",
          letterSpacing: "-.03em",
          margin: 0,
          color: "var(--fg-1)",
        }}>
          FAQ
        </h1>
        <p style={{
          font: "var(--body-lg)",
          color: "rgba(10,10,10,.6)",
          maxWidth: 620,
          margin: 0,
        }}>
          도입을 고민하면서 가장 많이 받는 일곱 가지 질문을 모았어요.<br />
          다른 게 궁금하면 언제든 물어봐 주세요.
        </p>
      </header>

      {/* Accordion */}
      <section style={{ padding: "20px 24px 80px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ borderTop: "1px solid rgba(10,10,10,.1)" }}>
            {items.map((it, i) => {
              const active = open === i;
              return (
                <div key={i} style={{ borderBottom: "1px solid rgba(10,10,10,.1)" }}>
                  <button
                    onClick={() => setOpen(active ? -1 : i)}
                    style={{
                      width: "100%",
                      background: "transparent",
                      border: 0,
                      padding: "32px 4px",
                      display: "grid",
                      gridTemplateColumns: "1fr auto",
                      gap: 24,
                      alignItems: "center",
                      cursor: "pointer",
                      textAlign: "left",
                      color: "var(--fg-1)",
                      font: `${active ? 600 : 500} 22px/1.4 var(--font-sans)`,
                      letterSpacing: "-.02em",
                      transition: "color .2s ease",
                    } as CSSProperties}
                  >
                    <span>{it.q}</span>
                    <span style={{
                      width: 28,
                      height: 28,
                      borderRadius: "50%",
                      background: active ? "var(--bg-dark)" : "rgba(10,10,10,.06)",
                      color: active ? "var(--fg-on-dark-1)" : "var(--fg-1)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      transition: "transform .35s cubic-bezier(.4,0,.2,1), background .25s ease",
                      transform: active ? "rotate(45deg)" : "rotate(0)",
                      flexShrink: 0,
                    }}>
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                        <path d="M6 1.5v9M1.5 6h9" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                      </svg>
                    </span>
                  </button>
                  <div style={{
                    maxHeight: active ? 240 : 0,
                    overflow: "hidden",
                    transition: "max-height .45s cubic-bezier(.4,0,.2,1), opacity .35s ease, padding .35s ease",
                    opacity: active ? 1 : 0,
                    padding: active ? "0 60px 32px 4px" : "0 60px 0 4px",
                  }}>
                    <p style={{
                      font: "var(--body-md)",
                      color: "rgba(10,10,10,.68)",
                      margin: 0,
                    }}>
                      {it.a}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </section>

      <Footer />
    </div>
  );
}
