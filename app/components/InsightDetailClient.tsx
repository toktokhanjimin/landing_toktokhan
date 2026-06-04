"use client";

import SiteHeader from "./SiteHeader";
import Footer from "./Footer";
import WhiteBackground from "./WhiteBackground";
import Badge from "./ui/Badge";
import type { InsightItem } from "../lib/store";

export default function InsightDetailClient({ item }: { item: InsightItem }) {
  const hasBody = item.body && item.body.trim() !== "" && item.body !== "<p></p>";

  return (
    <div style={{ background: "#fff", color: "var(--fg-1)", minHeight: "100dvh", display: "flex", flexDirection: "column" }}>
      <WhiteBackground />
      <SiteHeader forceLight current="Insight" />

      <article style={{ flex: 1, maxWidth: 760, margin: "0 auto", padding: "120px 24px 100px", width: "100%" }}>
        {/* 썸네일 */}
        {(() => {
          const cat = item.category ?? item.tag;
          const src = item.thumbImg ?? (["log", "talk", "tech"].includes(cat) ? `/assets/${cat}.png` : null);
          return src ? (
            <div style={{ width: "100%", aspectRatio: "16/9", borderRadius: "var(--r-xl)", overflow: "hidden", marginBottom: 40, background: item.thumb }}>
              <img src={src} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
            </div>
          ) : null;
        })()}

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
            dangerouslySetInnerHTML={{ __html: item.body! }}
          />
        )}
      </article>

      <Footer />
    </div>
  );
}
