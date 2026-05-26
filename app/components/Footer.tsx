"use client";

import Image from "next/image";

const SERVICE_ITEMS = ["AX 컨설팅", "교육", "개발", "AI 에이전트"];

const cols = [
  { h: "서비스", items: SERVICE_ITEMS },
  { h: "회사", items: ["회사 소개", "포트폴리오", "인사이트", "채용"] },
  { h: "우리가 만든 서비스", items: ["pluuug ↗", "POSTOO ↗"] },
  { h: "연락", items: ["sales@toktokhan.dev", "링크드인", "인스타그램"] },
];

export default function Footer() {
  return (
    <footer style={{ background: "var(--bg-elev)", color: "var(--fg-1)", padding: "26px 24px 48px" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        {/* Top grid */}
        <div className="footer-grid" style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr 1fr 1fr 1fr", gap: 48, paddingBottom: 48, paddingTop: 20 }}>
          <div className="footer-logo-col" style={{ display: "flex", flexDirection: "column", gap: 14, alignItems: "flex-start" }}>
            <a href="/" style={{ display: "block" }}>
              <Image src="/assets/tok-logo-black.svg" alt="TOKTOKHAN.DEV" width={220} height={56} style={{ height: 56, width: "auto", display: "block", marginLeft: -10 }} />
            </a>
          </div>
          {cols.map((c) => (
            <div key={c.h}>
              <div style={{ font: "700 14px/1 var(--font-sans)", letterSpacing: "-.01em", color: "var(--fg-1)", marginBottom: 24 }}>{c.h}</div>
              {c.items.map((item) => {
                const isService = SERVICE_ITEMS.includes(item);
                const href =
                  isService ? undefined :
                  item === "채용" ? "https://www.wanted.co.kr/company/30151" :
                  item === "링크드인" ? "https://www.linkedin.com/company/toktokhan/about/" :
                  item === "인스타그램" ? "https://www.instagram.com/toktokhan.dev/" :
                  item === "sales@toktokhan.dev" ? "mailto:sales@toktokhan.dev" :
                  item === "pluuug ↗" ? "https://www.pluuug.com/" :
                  item === "POSTOO ↗" ? "https://www.postoo.io/" :
                  item === "포트폴리오" ? "/work" :
                  item === "인사이트" ? "/insight" :
                  item === "회사 소개" ? "/" :
                  undefined;
                const isExternal = ["채용", "링크드인", "인스타그램", "pluuug ↗", "POSTOO ↗"].includes(item);
                return (
                  <a
                    key={item}
                    href={href}
                    target={isExternal ? "_blank" : undefined}
                    rel={isExternal ? "noopener noreferrer" : undefined}
                    style={{
                      font: "400 14px/1 var(--font-sans)",
                      color: "rgba(10,10,10,.5)",
                      marginBottom: 14,
                      display: "block",
                      textDecoration: "none",
                      cursor: isService ? "default" : "pointer",
                      userSelect: isService ? "none" : "auto",
                      pointerEvents: isService ? "none" : "auto",
                    }}
                  >
                    {item}
                  </a>
                );
              })}
            </div>
          ))}
        </div>

        {/* Bottom row */}
        <div className="footer-bottom" style={{ display: "grid", gridTemplateColumns: "1.4fr 4fr auto", paddingTop: 36, alignItems: "end", gap: 24 }}>
          <div className="footer-spacer" />
          <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
            <div style={{ font: "400 13px/1.4 var(--font-sans)", color: "rgba(10,10,10,.45)", marginBottom: 4 }}>04039 서울시 마포구 홍익로5안길 28, 5층</div>
            <div style={{ display: "flex", gap: "8px 32px", flexWrap: "wrap", alignItems: "center", font: "400 13px/1.4 var(--font-sans)", color: "rgba(10,10,10,.45)" }}>
              <span>대표자 서장원</span>
              <span>사업자등록번호 476-81-01694</span>
              <span>© 2021 Toktokhan.dev, Inc. All Rights Reserved.</span>
            </div>
          </div>
          <button
            aria-label="맨 위로"
            style={{ width: 56, height: 56, borderRadius: "var(--r-full)", background: "#E6E6E6", border: 0, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--fg-1)", transition: "background .2s ease, transform .2s ease" }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "#dcdcdc"; (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)"; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "#E6E6E6"; (e.currentTarget as HTMLElement).style.transform = "translateY(0)"; }}
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 19V5" /><path d="M5 12l7-7 7 7" />
            </svg>
          </button>
        </div>
      </div>
    </footer>
  );
}
