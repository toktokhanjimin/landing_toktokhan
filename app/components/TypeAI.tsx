"use client";

import { useRef, useState, useEffect, useMemo, CSSProperties } from "react";

export default function TypeAI() {
  const sectionRef = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);
  const tabsCount = 3;

  useEffect(() => {
    let raf = 0;
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        const el = sectionRef.current;
        if (!el) return;
        const rect = el.getBoundingClientRect();
        const vh = window.innerHeight;
        const total = el.offsetHeight - vh;
        const scrolled = Math.min(Math.max(-rect.top, 0), total);
        const p = total > 0 ? scrolled / total : 0;
        const idx = Math.min(tabsCount - 1, Math.floor(p * tabsCount));
        setActive(idx);
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  const tabs = [
    {
      label: "Design · Type 기반 AX 설계",
      desc: "업무를 자동화 영역과 Agent 영역으로 나눠 접근합니다. AI 적용 범위와 난이도를 최적화하고, 실질적 성과로 연결합니다.",
      visual: <DesignPreview />,
    },
    {
      label: "Optimize · 확률·결정 영역 분리",
      desc: "정확성이 필요한 영역은 Rule 기반과 API로 유지하고, 유연성이 필요한 영역에만 LLM을 적용합니다. 모든 업무를 AI로 대체하지 않습니다.",
      visual: <OptimizePreview />,
    },
    {
      label: "Operate · 엔터프라이즈 거버넌스",
      desc: "자동화가 아니라 책임과 통제가 핵심입니다. 사람의 승인 구조를 포함하고, 모든 의사결정은 기록·추적되며 규제 기준에 맞게 운영됩니다.",
      visual: <OperatePreview />,
    },
  ];

  const section: CSSProperties = {
    background: "#ffffff",
    color: "#0a0a0a",
    borderTop: "1px solid rgba(10,10,10,.08)",
    borderBottom: "1px solid rgba(10,10,10,.08)",
    position: "relative",
    height: `${tabsCount * 100}vh`,
  };

  const sticky: CSSProperties = {
    position: "sticky",
    top: 0,
    height: "100vh",
    display: "flex",
    alignItems: "center",
    padding: "0 24px",
    overflow: "hidden",
  };

  const inner: CSSProperties = {
    maxWidth: 1200,
    margin: "0 auto",
    width: "100%",
    display: "grid",
    gridTemplateColumns: "minmax(260px, 340px) 1fr",
    gap: 80,
    alignItems: "center",
  };

  const title: CSSProperties = {
    font: "700 clamp(30px,3.1vw,44px)/1.15 var(--font-sans)",
    letterSpacing: "-.025em",
    margin: "0 0 56px",
    whiteSpace: "pre-line",
    color: "#0a0a0a",
  };

  const preview: CSSProperties = {
    position: "relative",
    width: "100%",
    height: "min(78vh, 620px)",
    minHeight: 480,
    background: "#0f1013",
    border: "1px solid rgba(255,255,255,.08)",
    borderRadius: 18,
    overflow: "hidden",
    boxShadow: "0 40px 80px rgba(0,0,0,.5)",
  };

  const progress: CSSProperties = {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: 2,
    background: "rgba(255,255,255,.06)",
  };

  const progressBar: CSSProperties = {
    height: "100%",
    background: "#fff",
    width: `${((active + 1) / tabsCount) * 100}%`,
    transition: "width .4s var(--ease-out)",
  };

  return (
    <section ref={sectionRef} style={section}>
      <div style={sticky}>
        <div style={inner}>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <h2 style={title}>{`설계하고,\noptimize,\nand operate`}</h2>
            <div style={{ display: "flex", flexDirection: "column" }}>
              {tabs.map((t, i) => {
                const on = active === i;
                return (
                  <div
                    key={i}
                    style={{ padding: "20px 0", borderTop: "1px solid rgba(10,10,10,.1)", cursor: "pointer" }}
                    onClick={() => {
                      const el = sectionRef.current;
                      if (!el) return;
                      const vh = window.innerHeight;
                      const total = el.offsetHeight - vh;
                      const target = el.offsetTop + total * (i / tabsCount) + 4;
                      window.scrollTo({ top: target, behavior: "smooth" });
                    }}
                  >
                    <div style={{
                      font: "600 15px/1.2 var(--font-sans)",
                      color: on ? "#0a0a0a" : "rgba(10,10,10,.4)",
                      letterSpacing: "-.01em",
                      transition: "color .4s var(--ease-out)",
                    }}>
                      {t.label}
                    </div>
                    <div style={{ height: on ? 130 : 0, overflow: "hidden" }}>
                      <div style={{
                        paddingTop: 12,
                        opacity: on ? 1 : 0,
                        transition: "opacity .3s var(--ease-out)",
                      }}>
                        <div style={{ font: "400 14px/1.65 var(--font-sans)", color: "rgba(10,10,10,.6)" }}>
                          {t.desc}
                        </div>
                        <a style={{ display: "inline-flex", alignItems: "center", gap: 4, marginTop: 14, font: "500 13px/1 var(--font-sans)", color: "#0a0a0a" }}>
                          Learn more ›
                        </a>
                      </div>
                    </div>
                  </div>
                );
              })}
              <div style={{ borderTop: "1px solid rgba(10,10,10,.1)" }} />
            </div>
          </div>

          <div style={preview}>
            {tabs.map((t, i) => (
              <div
                key={i}
                style={{
                  position: "absolute",
                  inset: 0,
                  opacity: active === i ? 1 : 0,
                  transform: active === i ? "none" : "translateY(14px)",
                  transition: "opacity .5s var(--ease-out), transform .5s var(--ease-out)",
                  pointerEvents: active === i ? "auto" : "none",
                }}
              >
                {t.visual}
              </div>
            ))}
          </div>
        </div>
        <div style={progress}>
          <div style={progressBar} />
        </div>
      </div>
    </section>
  );
}

/* --- DesignPreview --- */

function DesignPreview() {
  const [t, setT] = useState(0);
  useEffect(() => {
    const DUR = 7000;
    let raf = 0;
    let start = 0;
    const tick = (ts: number) => {
      if (!start) start = ts;
      const p = ((ts - start) % DUR) / DUR;
      setT(p);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  const wrap: CSSProperties = {
    width: "100%",
    height: "100%",
    background: "radial-gradient(1200px 600px at 30% 0%, rgba(93,211,255,.08), transparent 60%), #0a0b0d",
    padding: 12,
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gridTemplateRows: "1.7fr 1fr",
    gap: 10,
  };

  const card: CSSProperties = {
    background: "rgba(20,22,26,.85)",
    border: "1px solid rgba(255,255,255,.07)",
    borderRadius: 14,
    overflow: "hidden",
    position: "relative",
  };

  const cardHead: CSSProperties = {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "12px 16px",
    borderBottom: "1px solid rgba(255,255,255,.06)",
  };

  const cardTitle: CSSProperties = {
    font: "600 12px/1.2 var(--font-sans)",
    color: "rgba(255,255,255,.92)",
    letterSpacing: "-.01em",
  };

  const cardMeta: CSSProperties = {
    font: "500 10px/1 var(--font-mono, 'IBM Plex Mono',monospace)",
    color: "rgba(255,255,255,.4)",
    letterSpacing: ".06em",
  };

  return (
    <div style={wrap}>
      <div style={{ ...card, gridColumn: "1 / span 2", gridRow: "1" }}>
        <div style={cardHead}>
          <div style={cardTitle}>Task architecture</div>
          <div style={cardMeta}>TYPE-BASED AX</div>
        </div>
        <TaskTree t={t} />
      </div>

      <div style={card}>
        <div style={cardHead}>
          <div style={cardTitle}>Throughput</div>
          <div style={cardMeta}>LIVE · 24H</div>
        </div>
        <ThroughputChart t={t} />
      </div>

      <div style={card}>
        <div style={cardHead}>
          <div style={cardTitle}>Activity</div>
          <div style={cardMeta}>LIVE</div>
        </div>
        <ActivityLog t={t} />
      </div>
    </div>
  );
}

/* --- TaskTree --- */

function IconCode() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="16 18 22 12 16 6" /><polyline points="8 6 2 12 8 18" />
    </svg>
  );
}

function IconAuto() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.9 4.9l2.1 2.1M17 17l2.1 2.1M4.9 19.1L7 17M17 7l2.1-2.1" />
    </svg>
  );
}

function IconAgent() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="4" y="6" width="16" height="12" rx="2" />
      <path d="M9 11h.01M15 11h.01M9 15h6" />
      <path d="M12 2v4" />
    </svg>
  );
}

function TaskTree({ t }: { t: number }) {
  const phase = t;
  const childActive = Math.floor(phase * 3) % 3;

  const nodes = [
    { id: 0, title: "코드", sub: "PYTHON · API · 룰 기반", chip: "결정적 접근", chipBg: "#00B7FF", icon: <IconCode />, accent: "#5DD3FF" },
    { id: 1, title: "자동화", sub: "LLM · 단순 확률 판단", chip: "확률적 접근", chipBg: "#E07A3A", icon: <IconAuto />, accent: "#e07a3a" },
    { id: 2, title: "에이전트", sub: "멀티스텝 · 복잡 추론", chip: "확률적 접근", chipBg: "#E07A3A", icon: <IconAgent />, accent: "#b388ff" },
  ];

  const wrap: CSSProperties = {
    position: "absolute",
    inset: 0,
    top: 38,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: "10px 18px 12px",
  };

  return (
    <div style={wrap}>
      <div style={{
        font: "500 9.5px/1 var(--font-mono, 'IBM Plex Mono',monospace)",
        letterSpacing: ".22em",
        color: "rgba(255,255,255,.45)",
        marginBottom: 10,
        whiteSpace: "nowrap",
      }}>
        TYPE 기반 AX 설계
      </div>

      <div style={{
        position: "relative",
        display: "inline-flex",
        alignItems: "center",
        gap: 8,
        padding: "9px 18px",
        borderRadius: 999,
        background: "linear-gradient(180deg,#33C6FF,#00B7FF)",
        boxShadow: `0 0 ${12 + Math.sin(phase * Math.PI * 2) * 8}px rgba(93,211,255,.55)`,
        font: "600 13px/1 var(--font-sans)",
        color: "#fff",
        letterSpacing: "-.005em",
        zIndex: 2,
      }}>
        <span style={{ width: 6, height: 6, borderRadius: 999, background: "#fff", opacity: 0.6 + Math.sin(phase * Math.PI * 2) * 0.4 }} />
        하나의 TASK
      </div>

      <svg viewBox="0 0 360 60" style={{ width: "100%", maxWidth: 360, height: 50, marginTop: 6, display: "block" }}>
        <defs>
          <linearGradient id="typeai-ln" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="rgba(93,211,255,.5)" />
            <stop offset="100%" stopColor="rgba(93,211,255,.12)" />
          </linearGradient>
        </defs>
        <line x1="180" y1="0" x2="180" y2="22" stroke="url(#typeai-ln)" strokeWidth="1.4" />
        <line x1="56" y1="22" x2="304" y2="22" stroke="url(#typeai-ln)" strokeWidth="1.4" />
        {[56, 180, 304].map((x, i) => (
          <line key={i} x1={x} y1="22" x2={x} y2="56" stroke="url(#typeai-ln)" strokeWidth="1.4" />
        ))}
        {[56, 180, 304].map((x, i) => {
          if (i !== childActive) return null;
          const localPhase = (phase * 3) % 1;
          const cy = 22 + localPhase * 34;
          return <circle key={"p" + i} cx={x} cy={cy} r="2.4" fill="#5DD3FF" />;
        })}
      </svg>

      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(3,minmax(0,1fr))",
        gap: 10,
        width: "100%",
      }}>
        {nodes.map((n, i) => {
          const on = i === childActive;
          return (
            <div key={n.id} style={{
              position: "relative",
              minWidth: 0,
              padding: "12px 10px 12px",
              borderRadius: 12,
              background: on
                ? "linear-gradient(180deg, rgba(93,211,255,.08), rgba(93,211,255,.02))"
                : "rgba(255,255,255,.025)",
              border: on ? `1px solid ${n.accent}66` : "1px solid rgba(255,255,255,.06)",
              boxShadow: on ? `0 0 24px ${n.accent}22 inset, 0 8px 24px rgba(0,0,0,.25)` : "none",
              transition: "background .35s var(--ease-out), border-color .35s var(--ease-out), box-shadow .35s var(--ease-out)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 6,
              minHeight: 110,
            }}>
              <div style={{
                width: 30,
                height: 30,
                borderRadius: 8,
                background: on ? `${n.accent}1f` : "rgba(255,255,255,.04)",
                border: `1px solid ${on ? n.accent + "55" : "rgba(255,255,255,.07)"}`,
                display: "grid",
                placeItems: "center",
                color: on ? n.accent : "rgba(255,255,255,.55)",
                transition: "all .35s var(--ease-out)",
                flexShrink: 0,
              }}>
                {n.icon}
              </div>
              <div style={{ font: "700 13px/1.1 var(--font-sans)", color: "#fff", marginTop: 1, whiteSpace: "nowrap" }}>{n.title}</div>
              <div style={{ font: "500 9.5px/1.2 var(--font-mono, 'IBM Plex Mono',monospace)", color: "rgba(255,255,255,.42)", letterSpacing: ".02em", textAlign: "center", whiteSpace: "nowrap" }}>{n.sub}</div>
              <div style={{
                marginTop: "auto",
                padding: "3px 8px",
                borderRadius: 999,
                background: on ? n.chipBg : "rgba(255,255,255,.06)",
                color: on ? "#fff" : "rgba(255,255,255,.5)",
                font: "600 9.5px/1 var(--font-sans)",
                letterSpacing: "-.005em",
                transition: "all .35s var(--ease-out)",
                whiteSpace: "nowrap",
              }}>
                {n.chip}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* --- ThroughputChart --- */

function ThroughputChart({ t }: { t: number }) {
  const W = 320, H = 96, PAD = 14;

  const pts = useMemo(() => {
    const N = 40;
    const arr: { x: number; y: number }[] = [];
    for (let i = 0; i < N; i++) {
      const x = i / (N - 1);
      const y = 0.5
        + 0.18 * Math.sin(x * 9.1)
        + 0.14 * Math.sin(x * 3.7 + 1.2)
        + 0.08 * Math.sin(x * 17.4 + 0.5);
      arr.push({ x: PAD + x * (W - PAD * 2), y: PAD + (1 - y) * (H - PAD * 2) });
    }
    return arr;
  }, []);

  const path = pts.map((p, i) => (i === 0 ? `M${p.x},${p.y}` : `L${p.x},${p.y}`)).join(" ");
  const area = path + ` L${pts[pts.length - 1].x},${H} L${pts[0].x},${H} Z`;
  const scanX = PAD + t * (W - PAD * 2);
  const i0 = Math.min(pts.length - 2, Math.floor(t * (pts.length - 1)));
  const seg = t * (pts.length - 1) - i0;
  const sy = pts[i0].y + (pts[i0 + 1].y - pts[i0].y) * seg;
  const live = Math.round(412 + Math.sin(t * Math.PI * 2) * 9 + Math.sin(t * Math.PI * 8) * 3);

  const secondaryPath = pts
    .map((p, i) => (i === 0 ? `M${p.x},${Math.min(H - PAD, p.y + 18)}` : `L${p.x},${Math.min(H - PAD, p.y + 18)}`))
    .join(" ");

  return (
    <div style={{ position: "absolute", inset: 0, top: 40, padding: "10px 12px", display: "flex", flexDirection: "column" }}>
      <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginBottom: 2, minWidth: 0 }}>
        <div style={{ minWidth: 0 }}>
          <div style={{ font: "500 9px/1 var(--font-mono, 'IBM Plex Mono',monospace)", color: "rgba(255,255,255,.45)", letterSpacing: ".06em", whiteSpace: "nowrap" }}>TASKS / MIN</div>
          <div style={{ font: "700 20px/1.1 var(--font-sans)", color: "#fff", letterSpacing: "-.02em", fontVariantNumeric: "tabular-nums" }}>{live}</div>
        </div>
      </div>
      <svg viewBox={`0 0 ${W} ${H}`} style={{ width: "100%", height: "auto", display: "block" }}>
        <defs>
          <linearGradient id="typeai-ar" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="rgba(93,211,255,.35)" />
            <stop offset="100%" stopColor="rgba(93,211,255,0)" />
          </linearGradient>
        </defs>
        <path d={area} fill="url(#typeai-ar)" />
        <path d={path} fill="none" stroke="#5DD3FF" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        <path d={secondaryPath} fill="none" stroke="rgba(224,122,58,.65)" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
        <line x1={scanX} y1={PAD} x2={scanX} y2={H - PAD} stroke="rgba(255,255,255,.18)" strokeDasharray="2 3" strokeWidth="1" />
        <circle cx={scanX} cy={sy} r="3.2" fill="#fff" />
        <circle cx={scanX} cy={sy} r="6" fill="rgba(93,211,255,.25)" />
      </svg>
      <div style={{ display: "flex", gap: 10, marginTop: 4, justifyContent: "flex-end" }}>
        <Legend dot="#5DD3FF" label="자동화" />
        <Legend dot="#e07a3a" label="에이전트" />
      </div>
    </div>
  );
}

function Legend({ dot, label }: { dot: string; label: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 5, font: "500 10px/1 var(--font-sans)", color: "rgba(255,255,255,.55)" }}>
      <span style={{ width: 6, height: 6, borderRadius: 999, background: dot }} />{label}
    </div>
  );
}

/* --- ActivityLog --- */

function ActivityLog({ t }: { t: number }) {
  const items = [
    { dot: "#5DD3FF", label: "Agent · invoice classify", tag: "auto", tagColor: "#5DD3FF" },
    { dot: "#e07a3a", label: "LLM · contract summarize", tag: "prob", tagColor: "#e07a3a" },
    { dot: "#4ade80", label: "Rule · payment route", tag: "det", tagColor: "#4ade80" },
    { dot: "#b388ff", label: "Agent · multi-step research", tag: "agent", tagColor: "#b388ff" },
    { dot: "#f4c14c", label: "Human review · refund", tag: "review", tagColor: "#f4c14c" },
    { dot: "#5DD3FF", label: "API · CRM sync", tag: "det", tagColor: "#4ade80" },
    { dot: "#e07a3a", label: "LLM · email draft", tag: "prob", tagColor: "#e07a3a" },
  ];
  const ROW_H = 26;
  const VISIBLE = 4;
  const offsetIdx = (t * items.length) % items.length;
  const ty = -offsetIdx * ROW_H;

  return (
    <div style={{ position: "absolute", inset: 0, top: 44, padding: "8px 12px", overflow: "hidden" }}>
      <div style={{
        position: "relative",
        height: ROW_H * VISIBLE,
        overflow: "hidden",
        maskImage: "linear-gradient(180deg, transparent 0, #000 12%, #000 88%, transparent 100%)",
        WebkitMaskImage: "linear-gradient(180deg, transparent 0, #000 12%, #000 88%, transparent 100%)",
      } as CSSProperties}>
        <div style={{ transform: `translateY(${ty}px)`, willChange: "transform" }}>
          {[...items, ...items].map((r, i) => (
            <div key={i} style={{
              height: ROW_H,
              display: "flex",
              alignItems: "center",
              gap: 8,
              padding: "0 4px",
              borderBottom: "1px solid rgba(255,255,255,.04)",
            }}>
              <span style={{ width: 6, height: 6, borderRadius: 999, background: r.dot, flexShrink: 0, boxShadow: `0 0 8px ${r.dot}` }} />
              <span style={{ flex: 1, font: "500 11px/1 var(--font-sans)", color: "rgba(255,255,255,.78)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{r.label}</span>
              <span style={{
                font: "600 9px/1 var(--font-mono, 'IBM Plex Mono',monospace)",
                letterSpacing: ".06em",
                textTransform: "uppercase",
                color: r.tagColor,
                padding: "3px 6px",
                borderRadius: 4,
                background: `${r.tagColor}15`,
                border: `1px solid ${r.tagColor}30`,
              }}>{r.tag}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* --- OptimizePreview --- */

function OptimizePreview() {
  return (
    <div style={{ width: "100%", height: "100%", background: "#0f1013", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <svg viewBox="0 0 520 340" style={{ width: "85%", height: "auto", display: "block" }}>
        <defs>
          <marker id="typeai-arr2" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto">
            <path d="M0,0 L10,5 L0,10 Z" fill="#5DD3FF" />
          </marker>
        </defs>
        <rect x="40" y="60" width="160" height="70" rx="14" fill="#18204a" stroke="#5DD3FF" strokeWidth="1.2" />
        <text x="120" y="95" textAnchor="middle" fontSize="15" fontFamily="var(--font-sans)" fill="#A8E5FF" fontWeight="600">Rule · API</text>
        <text x="120" y="115" textAnchor="middle" fontSize="11" fontFamily="var(--font-mono, 'IBM Plex Mono',monospace)" fill="rgba(168,229,255,.6)">deterministic</text>

        <rect x="320" y="60" width="160" height="70" rx="14" fill="#2b1a10" stroke="#e07a3a" strokeWidth="1.2" />
        <text x="400" y="95" textAnchor="middle" fontSize="15" fontFamily="var(--font-sans)" fill="#e07a3a" fontWeight="600">LLM · Agent</text>
        <text x="400" y="115" textAnchor="middle" fontSize="11" fontFamily="var(--font-mono, 'IBM Plex Mono',monospace)" fill="rgba(224,122,58,.6)">probabilistic</text>

        <rect x="200" y="230" width="120" height="60" rx="12" fill="#fff" />
        <text x="260" y="265" textAnchor="middle" fontSize="15" fontFamily="var(--font-sans)" fill="#0a0a0a" fontWeight="600">Workflow</text>

        <line x1="120" y1="130" x2="230" y2="225" stroke="#5DD3FF" strokeWidth="1.6" markerEnd="url(#typeai-arr2)" />
        <line x1="400" y1="130" x2="290" y2="225" stroke="#e07a3a" strokeWidth="1.6" markerEnd="url(#typeai-arr2)" />
      </svg>
    </div>
  );
}

/* --- OperatePreview --- */

function OperatePreview() {
  const rows = [
    { dot: "#5DD3FF", label: "Agent decision", time: "14:32", status: "Approved", color: "#4ade80" },
    { dot: "#e07a3a", label: "Human review", time: "14:34", status: "Pending", color: "#f4c14c" },
    { dot: "#fff", label: "Audit log · immutable", time: "14:35", status: "SHA-256", color: "rgba(255,255,255,.55)" },
    { dot: "#b388ff", label: "Policy check", time: "14:36", status: "Compliant", color: "#4ade80" },
  ];
  return (
    <div style={{ width: "100%", height: "100%", background: "#0f1013", padding: 40, display: "flex", flexDirection: "column", justifyContent: "center", gap: 10 }}>
      {rows.map((r, i) => (
        <div key={i} style={{ display: "flex", alignItems: "center", gap: 14, padding: "14px 18px", background: "#17181a", borderRadius: 12, border: "1px solid rgba(255,255,255,.06)" }}>
          <span style={{ width: 8, height: 8, borderRadius: 999, background: r.dot, flexShrink: 0 }} />
          <span style={{ flex: 1, font: "500 14px/1.2 var(--font-sans)", color: "#fff" }}>{r.label}</span>
          <span style={{ font: "500 12px/1 var(--font-mono, 'IBM Plex Mono',monospace)", color: "rgba(255,255,255,.45)" }}>{r.time}</span>
          <span style={{ font: "500 12px/1 var(--font-mono, 'IBM Plex Mono',monospace)", color: r.color, minWidth: 90, textAlign: "right" }}>{r.status}</span>
        </div>
      ))}
    </div>
  );
}
