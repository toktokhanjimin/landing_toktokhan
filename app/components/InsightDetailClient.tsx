"use client";

import { useState } from "react";
import SiteHeader from "./SiteHeader";
import Footer from "./Footer";
import WhiteBackground from "./WhiteBackground";
import Badge from "./ui/Badge";
import type { InsightItem } from "../lib/store";

/** 링크 카드: div[data-link-card] → 클릭 가능한 <a> 카드로 변환
 *  renderHTML 은 atom 노드라 내부 HTML 없이 빈 div 로 저장됨 →
 *  data-* 속성에서 title/desc/img 를 직접 재조립해야 함 */
function normalizeLinkCards(html: string): string {
  return html.replace(
    /<div([^>]*?data-link-card=""[^>]*?)>[\s\S]*?<\/div>/gi,
    (_m, divAttrs) => {
      const getAttr = (key: string) => {
        const m = new RegExp(`data-${key}="([^"]*)"`, "i").exec(divAttrs);
        return m ? m[1].replace(/&amp;/g, "&").replace(/&quot;/g, '"') : "";
      };

      const href  = getAttr("href");
      if (!href) return _m;

      const title = getAttr("title") || href;
      const desc  = getAttr("desc");
      const img   = getAttr("img");

      const descHtml = desc
        ? `<p class="link-card-desc">${desc}</p>`
        : "";
      const imgHtml = img
        ? `<div class="link-card-img"><img src="${img}" alt="" loading="lazy" /></div>`
        : `<div class="link-card-img link-card-img--empty"></div>`;

      return (
        `<a href="${href}" target="_blank" rel="noopener noreferrer" class="link-card">` +
          `<div class="link-card-body">` +
            `<strong class="link-card-title">${title}</strong>` +
            descHtml +
            `<span class="link-card-url">${href}</span>` +
          `</div>` +
          imgHtml +
        `</a>`
      );
    }
  );
}

/** YouTube embed wrapper + iframe에 인라인 반응형 스타일 주입 */
function normalizeYoutubeHtml(html: string): string {
  const WRAPPER_STYLE =
    'style="position:relative;display:block;width:100%;height:0;padding-bottom:56.25%;overflow:hidden;border-radius:10px;margin:1.5em 0;"';
  const IFRAME_STYLE =
    'style="position:absolute;top:0;left:0;width:100%;height:100%;border:none;"';

  return html.replace(
    /(<div)([^>]*?data-youtube-video[^>]*?)(>)([\s]*<iframe)([^>]*?)(>)/gi,
    (_m, d1, d2, d3, i1, iAttrs, i3) => {
      const cleaned = iAttrs
        .replace(/\s+width="\d+"/gi, "")
        .replace(/\s+height="\d+"/gi, "")
        .replace(/\s+style="[^"]*"/gi, "");
      return `${d1}${d2} ${WRAPPER_STYLE}${d3}${i1}${cleaned} ${IFRAME_STYLE}${i3}`;
    }
  );
}

/** 인사이트 하단 공유 섹션 (에디터 미노출, 유저 페이지 전용) */
function ShareSection() {
  const [toast, setToast] = useState(false);

  function shareUrl(platform: "facebook" | "linkedin") {
    const url = encodeURIComponent(window.location.href);
    const targets: Record<string, string> = {
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${url}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${url}`,
    };
    window.open(targets[platform], "_blank", "noopener,noreferrer");
  }

  function handleCopy() {
    navigator.clipboard.writeText(window.location.href).then(() => {
      setToast(true);
      setTimeout(() => setToast(false), 2200);
    });
  }

  const iconBtn: React.CSSProperties = {
    background: "none",
    border: "none",
    cursor: "pointer",
    padding: 6,
    lineHeight: 0,
    color: "rgba(10,10,10,.55)",
    borderRadius: "50%",
    transition: "color .15s",
  };

  return (
    <>
      {/* 토스트 */}
      <div style={{
        position: "fixed",
        bottom: 32,
        left: "50%",
        transform: `translateX(-50%) translateY(${toast ? 0 : 12}px)`,
        opacity: toast ? 1 : 0,
        transition: "opacity .22s ease, transform .22s ease",
        pointerEvents: "none",
        zIndex: 9999,
        background: "#0a0a0a",
        color: "#fff",
        font: "500 14px/1 var(--font-sans)",
        padding: "12px 20px",
        borderRadius: 100,
        whiteSpace: "nowrap",
        boxShadow: "0 4px 20px rgba(0,0,0,.18)",
      }}>
        클립보드에 복사되었어요 ✓
      </div>

      {/* 공유 섹션 */}
      <div style={{
        marginTop: 80,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 14,
        textAlign: "center",
      }}>
        <span style={{ font: "400 14px/1 var(--font-sans)", color: "rgba(10,10,10,.4)" }}>
          이 글을 공유해보세요!
        </span>
        <div style={{ display: "flex", gap: 20, alignItems: "center" }}>
          {/* Facebook */}
          <button style={iconBtn} onClick={() => shareUrl("facebook")} title="Facebook 공유">
            <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
            </svg>
          </button>
          {/* LinkedIn */}
          <button style={iconBtn} onClick={() => shareUrl("linkedin")} title="LinkedIn 공유">
            <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
            </svg>
          </button>
          {/* 링크 복사 */}
          <button style={iconBtn} onClick={handleCopy} title="링크 복사">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20">
              <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>
              <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
            </svg>
          </button>
        </div>
      </div>
    </>
  );
}

export default function InsightDetailClient({ item }: { item: InsightItem }) {
  const hasBody = item.body && item.body.trim() !== "" && item.body !== "<p></p>";

  return (
    <div style={{ background: "#fff", color: "var(--fg-1)", minHeight: "100dvh", display: "flex", flexDirection: "column" }}>
      <WhiteBackground />
      <SiteHeader forceLight current="Insight" />

      <article style={{ flex: 1, maxWidth: 760, margin: "0 auto", padding: "120px 24px 100px", width: "100%" }}>
        {/* 메타 */}
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20, flexWrap: "wrap" }}>
          <Badge>{item.tag}</Badge>
          <span style={{ font: "400 13px/1 var(--font-sans)", color: "rgba(10,10,10,.4)" }}>{item.date}</span>
        </div>

        {/* 제목 */}
        <h1 style={{
          font: "700 clamp(26px, 3.6vw, 42px)/1.28 var(--font-sans)",
          letterSpacing: "-.03em",
          color: "var(--fg-1)",
          margin: "0 0 20px",
          whiteSpace: "pre-line",
        }}>
          {item.title}
        </h1>

        {/* 요약 */}
        {item.excerpt && (
          <p style={{
            font: "400 17px/1.7 var(--font-sans)",
            color: "rgba(10,10,10,.6)",
            margin: "0 0 40px",
            paddingBottom: 40,
            borderBottom: "1px solid rgba(10,10,10,.08)",
          }}>
            {item.excerpt}
          </p>
        )}

        {/* 본문 */}
        {hasBody && (
          <div
            className="tiptap-content"
            dangerouslySetInnerHTML={{ __html: normalizeLinkCards(normalizeYoutubeHtml(item.body!)) }}
          />
        )}

        {/* 하단 고정 섹션 — 에디터 미노출, 유저 페이지 전용 */}
        <ShareSection />
      </article>

      <Footer />
    </div>
  );
}
