"use client";

import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import SiteHeader from "../../components/SiteHeader";
import Footer from "../../components/Footer";
import { getWork, getInsights, type WorkItem, type InsightItem } from "../../lib/store";

export default function CaseDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const [cases, setCases] = useState<WorkItem[]>([]);
  const [related, setRelated] = useState<InsightItem[]>([]);

  useEffect(() => {
    const workData = getWork();
    const insightData = getInsights();
    setCases(workData);
    setRelated(insightData.slice(0, 3));
    const prev = document.body.style.background;
    document.body.style.background = "#ffffff";
    return () => { document.body.style.background = prev; };
  }, []);

  const idx = cases.length > 0 ? Math.max(0, cases.findIndex((c) => c.id === id)) : 0;
  const c = cases[idx] ?? null;
  const next = cases.length > 0 ? cases[(idx + 1) % cases.length] : null;

  const mono = "'IBM Plex Mono', monospace";

  if (!c) {
    return (
      <div style={{ background: "#ffffff", color: "#0a0a0a", minHeight: "100dvh" }}>
        <SiteHeader forceLight current="Work" />
      </div>
    );
  }

  return (
    <div style={{ background: "#ffffff", color: "#0a0a0a", minHeight: "100dvh" }}>
      <SiteHeader forceLight current="Work" />

      {/* Cover */}
      <section style={{ background: c.bg, padding: "168px 24px 80px", color: "#fff", position: "relative", overflow: "hidden" }}>
        <div style={{ maxWidth: 1248, margin: "0 auto", position: "relative", zIndex: 1 }}>
          <div style={{
            display: "flex", gap: 14, alignItems: "center",
            font: `500 12px/1 ${mono}`, letterSpacing: ".14em",
            color: "rgba(255,255,255,.7)", marginBottom: 24,
          }}>
            <span style={{ font: `700 14px/1 var(--font-sans)`, letterSpacing: ".06em", color: "#fff" }}>{c.client}</span>
            <span style={{ color: "rgba(255,255,255,.3)" }}>•</span>
            <span>{c.tag}</span>
            <span style={{ color: "rgba(255,255,255,.3)" }}>•</span>
            <span style={{
              display: "inline-block", font: `500 11px/1 ${mono}`, letterSpacing: ".14em",
              padding: "5px 8px", borderRadius: 4, background: "rgba(255,255,255,.18)", color: "#fff",
            }}>{c.category}</span>
            <span style={{ color: "rgba(255,255,255,.3)" }}>•</span>
            <span>{c.date}</span>
          </div>
          <h1 style={{
            font: "700 clamp(34px,5vw,68px)/1.18 var(--font-sans)",
            letterSpacing: "-.035em", color: "#fff", margin: 0, maxWidth: 940,
          }}>{c.title}</h1>
          <p style={{
            font: "400 18px/1.6 var(--font-sans)",
            color: "rgba(255,255,255,.8)", margin: "24px 0 0", maxWidth: 720,
          }}>{c.lead}</p>
        </div>
      </section>

      {/* Body */}
      <main style={{ maxWidth: 1248, margin: "0 auto", padding: "100px 24px 0", display: "grid", gridTemplateColumns: "1fr", gap: 80 }}>
        {c.sections.map((sec, i) => (
          <section key={i} style={{ display: "grid", gridTemplateColumns: "180px 1fr", gap: 60, alignItems: "start" }}>
            <div style={{ font: `500 13px/1 ${mono}`, letterSpacing: ".16em", color: "rgba(10,10,10,.45)", paddingTop: 8 }}>
              0{i + 1} / 0{c.sections.length}
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
              <h2 style={{ font: "700 28px/1.3 var(--font-sans)", letterSpacing: "-.02em", color: "#0a0a0a", margin: 0 }}>
                {sec.h}
              </h2>
              <p style={{ font: "400 17px/1.75 var(--font-sans)", color: "rgba(10,10,10,.78)", margin: 0, maxWidth: 720 }}>
                {sec.p}
              </p>
              <div style={{ height: 320, borderRadius: 14, background: sec.grad, position: "relative", overflow: "hidden", boxShadow: "0 8px 32px rgba(0,0,0,.08)" }} />
            </div>
          </section>
        ))}

        {/* Points */}
        <section style={{ display: "grid", gridTemplateColumns: "180px 1fr", gap: 60, alignItems: "start" }}>
          <div style={{ font: `500 13px/1 ${mono}`, letterSpacing: ".16em", color: "rgba(10,10,10,.45)", paddingTop: 8 }}>
            핵심 포인트
          </div>
          <div>
            <div style={{ background: "#f6f6f6", borderRadius: 18, padding: "40px 48px" }}>
              <div style={{
                font: "700 18px/1 var(--font-sans)", letterSpacing: "-.01em",
                color: "#0a0a0a", marginBottom: 24, display: "flex", alignItems: "center", gap: 10,
              }}>
                📌 이 작업의 포인트
              </div>
              <ul style={{ display: "flex", flexDirection: "column", gap: 16, margin: 0, padding: 0, listStyle: "none" }}>
                {c.points.map((pt, i) => (
                  <li key={i} style={{
                    display: "grid", gridTemplateColumns: "28px 1fr", gap: 14,
                    alignItems: "baseline", font: "500 16px/1.55 var(--font-sans)", color: "#0a0a0a",
                  }}>
                    <span style={{ font: `500 12px/1 ${mono}`, color: "rgba(10,10,10,.45)", letterSpacing: ".1em" }}>
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span>{pt}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>
      </main>

      {/* Nav */}
      {next && (
        <nav style={{
          maxWidth: 1248, margin: "120px auto 0", padding: "60px 24px 80px",
          borderTop: "1px solid rgba(10,10,10,.08)",
          display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24,
        }}>
          <a href="/work" style={{ display: "flex", flexDirection: "column", gap: 10, textDecoration: "none", color: "inherit" }}>
            <span style={{ font: `500 12px/1 ${mono}`, letterSpacing: ".14em", color: "rgba(10,10,10,.45)" }}>← 목록으로 돌아가기</span>
            <span style={{ font: "700 22px/1.3 var(--font-sans)", letterSpacing: "-.02em", color: "#0a0a0a" }}>Work</span>
            <span style={{ font: "400 14px/1.5 var(--font-sans)", color: "rgba(10,10,10,.6)" }}>고객사와 함께 만든 AX · AI · Ops 프로젝트들</span>
          </a>
          <a href={`/work/${next.id}`} style={{
            display: "flex", flexDirection: "column", gap: 10,
            textDecoration: "none", color: "inherit", textAlign: "right", alignItems: "flex-end",
          }}>
            <span style={{ font: `500 12px/1 ${mono}`, letterSpacing: ".14em", color: "rgba(10,10,10,.45)" }}>다음 사례 →</span>
            <span style={{ font: "700 22px/1.3 var(--font-sans)", letterSpacing: "-.02em", color: "#0a0a0a", maxWidth: 420 }}>{next.client} — {next.tag}</span>
            <span style={{ font: "400 14px/1.5 var(--font-sans)", color: "rgba(10,10,10,.6)" }}>{next.title}</span>
          </a>
        </nav>
      )}

      {/* Related insights */}
      {related.length > 0 && (
        <section style={{ background: "#fafafa", padding: "100px 24px 120px", marginTop: 0 }}>
          <div style={{ maxWidth: 1248, margin: "0 auto" }}>
            <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: 36 }}>
              <h2 style={{ font: "700 28px/1.2 var(--font-sans)", letterSpacing: "-.02em", color: "#0a0a0a", margin: 0 }}>관련 인사이트</h2>
              <a href="/insight" style={{ font: "500 14px/1 var(--font-sans)", color: "rgba(10,10,10,.6)", textDecoration: "none" }}>전체 보기 →</a>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24 }}>
              {related.map((r, i) => (
                <a key={i} href="/insight" style={{ display: "flex", flexDirection: "column", gap: 14, textDecoration: "none", color: "inherit" }}>
                  <div style={{ width: "100%", aspectRatio: "16/10", borderRadius: 12, background: r.thumb }} />
                  <div style={{ font: `500 12px/1 ${mono}`, letterSpacing: ".1em", color: "rgba(10,10,10,.5)" }}>{r.tag} · {r.date}</div>
                  <h3 style={{ font: "600 17px/1.4 var(--font-sans)", letterSpacing: "-.01em", color: "#0a0a0a", margin: 0, whiteSpace: "pre-line" }}>{r.title}</h3>
                </a>
              ))}
            </div>
          </div>
        </section>
      )}

      <Footer />
    </div>
  );
}
