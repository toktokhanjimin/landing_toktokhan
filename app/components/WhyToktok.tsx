"use client";

import { useState, useEffect, useRef, CSSProperties } from "react";
import Image from "next/image";

/* ======================== Visuals ======================== */

function SpinCircle({ active }: { active?: boolean }) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0 }}>
      <style>{`@keyframes wt-spin{to{transform:rotate(360deg)}} .wt-arc{transform-origin:12px 12px;animation:wt-spin 1.1s linear infinite}`}</style>
      <circle cx="12" cy="12" r="9.5" stroke={active ? "#dde0f0" : "#ebebeb"} strokeWidth="2.4" />
      {active && <path className="wt-arc" d="M12 2.5a9.5 9.5 0 0 1 9.5 9.5" stroke="#4e5fd4" strokeWidth="2.4" strokeLinecap="round" style={{ animationDuration: "1.2s" }} />}
    </svg>
  );
}

function CheckCircle() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0 }}>
      <style>{`@keyframes wt-pop{0%{opacity:0;transform:scale(.7)}100%{opacity:1;transform:scale(1)}} .wt-check{animation:wt-pop .25s ease-out both}`}</style>
      <circle className="wt-check" cx="12" cy="12" r="9.5" fill="#1ea659" />
      <path className="wt-check" d="M8 12.2l2.8 2.8 5.2-5.2" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ animationDelay: ".05s" }} />
    </svg>
  );
}

function VisualEndToEnd() {
  const steps = [
    { icon: "/assets/Planning-icon.png", title: "기획", sub: "요구사항 정의 / IA / 정책 설계" },
    { icon: "/assets/Design-icon.png", title: "디자인", sub: "와이어프레임 / UXUI / 프로토타입" },
    { icon: "/assets/Dev-icon.png", title: "개발", sub: "프론트엔드 / 백엔드 / 인프라" },
    { icon: "/assets/QA-icon.png", title: "QA", sub: "테스트 케이스 / 운영 검수 / 배포 대응" },
  ];

  const [completedCount, setCompletedCount] = useState(0);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    const advance = (current: number) => {
      if (current < steps.length) {
        timer = setTimeout(() => {
          setCompletedCount(current + 1);
          advance(current + 1);
        }, 1200);
      } else {
        timer = setTimeout(() => {
          setCompletedCount(0);
          advance(0);
        }, 900);
      }
    };
    advance(0);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div style={{
      width: "100%",
      height: "100%",
      borderRadius: 28,
      padding: "24px",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      gap: 8,
      boxSizing: "border-box",
    }}>
      {/* Top notification */}
      <div style={{
        alignSelf: "flex-end",
        display: "inline-flex",
        alignItems: "center",
        gap: 7,
        background: "#fff",
        borderRadius: 999,
        padding: "7px 13px",
        boxShadow: "0 2px 8px rgba(0,0,0,.07)",
        marginBottom: 2,
        marginInline: "12px",
      }}>
        <Image src="/assets/asterisk-blue.png" alt="" width={16} height={16} style={{ objectFit: "contain", flexShrink: 0 }} />
        <span style={{ font: "600 12px/1 var(--font-sans)", color: "#0a0a0a", letterSpacing: "-.01em" }}>
          프로젝트가 시작되었습니다.
        </span>
      </div>

      {/* Step rows */}
      {steps.map((step, i) => {
        const done   = i < completedCount;
        const active = i === completedCount;
        return (
          <div key={step.title} style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            background: "#fff",
            borderRadius: 14,
            padding: "12px 14px",
            boxShadow: "0 1px 6px rgba(0,0,0,.06)",
            marginInline: "12px",
          }}>
            <div style={{
              width: 40,
              height: 40,
              borderRadius: 11,
              background: "#f2f2f5",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
              overflow: "hidden",
            }}>
              <Image src={step.icon} alt={step.title} width={22} height={22} style={{ objectFit: "contain" }} />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ font: "600 13px/1 var(--font-sans)", color: "#0a0a0a", marginBottom: 5 }}>
                {step.title}
              </div>
              <div style={{ font: "400 11.5px/1.3 var(--font-sans)", color: "rgba(10,10,10,.45)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {step.sub}
              </div>
            </div>
            {done ? <CheckCircle /> : <SpinCircle active={active} />}
          </div>
        );
      })}
    </div>
  );
}

function VisualInternalize() {
  /* ─── coordinate system ────────────────────────────────────
     Card aspectRatio = 1 / 1.06  →  W=360, H=382
     SVG viewBox = "0 0 360 382", preserveAspectRatio="none"

     Horizontal  (pad 24 + marginInline 12 = 36px each side):
       col width = (360-72-8)/2 = 140px
       lx = 36+70 = 106   rx = 184+70 = 254   mx = 180

     Vertical  (all elements have fixed heights):
       pad        : 24px
       top pill   : h=40  → y 24–64
       top conn   : 64 → 118  (branch at y=91)
       row cards  : h=64  → row1: 118–182, gap 8, row2: 190–254
       btm conn   : 254 → 314 (merge at y=284)
       btm pill   : h=44  → y 314–358
       btm pad    : 382–358 = 24px ✓
  ─────────────────────────────────────────────────────────── */
  const W = 360, H = 382;
  const lx = 106, rx = 254, mx = 180, r = 8;
  const lc = "#ffffff";

  const depts = [
    { id: "DEV",    count: 32, img: "/assets/Group-dev-icon.png"    },
    { id: "DESIGN", count: 25, img: "/assets/Group-design-icon.png" },
    { id: "SALES",  count: 12, img: "/assets/Group-sales-icon.png"  },
    { id: "HR",     count: 5,  img: "/assets/Group-hr-icon.png"     },
  ];

  const [activeCount, setActiveCount] = useState(0);
  const [nativeOn, setNativeOn] = useState(false);

  useEffect(() => {
    let t: ReturnType<typeof setTimeout>;
    const run = (n: number) => {
      if (n < depts.length) {
        t = setTimeout(() => { setActiveCount(n + 1); run(n + 1); }, 700);
      } else {
        t = setTimeout(() => {
          setNativeOn(true);
          t = setTimeout(() => { setActiveCount(0); setNativeOn(false); run(0); }, 1100);
        }, 400);
      }
    };
    run(0);
    return () => clearTimeout(t);
  }, []);

  const PersonIcon = ({ on }: { on: boolean }) => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="8" r="4" fill={on ? "#fff" : "rgba(10,10,10,.3)"} />
      <path d="M4 20c0-3.5 3.6-6 8-6s8 2.5 8 6" stroke={on ? "#fff" : "rgba(10,10,10,.3)"} strokeWidth="2" strokeLinecap="round" fill="none" />
    </svg>
  );

  // % helpers
  const py = (y: number) => `${(y / H * 100).toFixed(3)}%`;
  const px = (x: number) => `${(x / W * 100).toFixed(3)}%`;

  return (
    <div style={{ width: "100%", height: "100%", position: "relative", overflow: "hidden" }}>
      <style dangerouslySetInnerHTML={{ __html: `@keyframes vi-spin{to{transform:rotate(360deg)}} .vi-arc{transform-origin:10px 10px;animation:vi-spin 1.2s linear infinite}` }} />

      {/* ── SVG connector lines ── */}
      <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none"
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none" }}>
        {/* top pill(y=81) → branch → row1 top(y=123) */}
        <path d={`M${mx} 81 L${mx} 94 Q${mx} 102 ${mx-r} 102 L${lx+r} 102 Q${lx} 102 ${lx} 110 L${lx} 123`}
          stroke={lc} strokeWidth="1.5" fill="none" />
        <path d={`M${mx} 94 Q${mx} 102 ${mx+r} 102 L${rx-r} 102 Q${rx} 102 ${rx} 110 L${rx} 123`}
          stroke={lc} strokeWidth="1.5" fill="none" />
        {/* row1 bottom(187) → row2 top(191) */}
        <line x1={lx} y1="187" x2={lx} y2="191" stroke={lc} strokeWidth="1.5" />
        <line x1={rx} y1="187" x2={rx} y2="191" stroke={lc} strokeWidth="1.5" />
        {/* row2 bottom(255) → merge → btm pill top(297)  side=13px, center=13px */}
        <path d={`M${lx} 255 L${lx} 268 Q${lx} 276 ${lx+r} 276 L${mx-r} 276 Q${mx} 276 ${mx} 284 L${mx} 297`}
          stroke={lc} strokeWidth="1.5" fill="none" />
        <path d={`M${rx} 255 L${rx} 268 Q${rx} 276 ${rx-r} 276 L${mx+r} 276 Q${mx} 276 ${mx} 284`}
          stroke={lc} strokeWidth="1.5" fill="none" />
      </svg>

      {/* ── Top pill: AI 도입 (h=40, y 41–81) ── */}
      <div style={{
        position: "absolute", top: py(41), left: "50%", transform: "translateX(-50%)",
        height: 40, background: "#0a0a0a", color: "#fff", borderRadius: 999,
        padding: "0 22px", display: "flex", alignItems: "center", gap: 9, whiteSpace: "nowrap", zIndex: 1,
        boxSizing: "border-box",
      }}>
        <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
          <circle cx="10" cy="10" r="8" stroke="rgba(255,255,255,.2)" strokeWidth="2" />
          <path className="vi-arc" d="M10 2a8 8 0 0 1 8 8" stroke="#00B7FF" strokeWidth="2" strokeLinecap="round" />
        </svg>
        <span style={{ font: "700 15px/1 var(--font-sans)", letterSpacing: "-.01em" }}>AI 도입</span>
      </div>

      {/* ── 2×2 dept cards (h=64, row1 y 118, row2 y 190) ── */}
      {depts.map((d, i) => {
        const on  = i < activeCount;
        const col = i % 2;
        const row = Math.floor(i / 2);
        return (
          <div key={d.id} style={{
            position: "absolute",
            top:    py(row === 0 ? 123 : 191),
            left:   col === 0 ? px(36) : px(184),
            width:  px(140),
            height: py(64),
            background: "#fff", borderRadius: 14,
            padding: "0 12px",
            boxShadow: on ? "0 2px 12px rgba(78,95,212,.15)" : "0 1px 6px rgba(0,0,0,.07)",
            border: on ? "1.5px solid rgba(78,95,212,.26)" : "1.5px solid transparent",
            display: "flex", alignItems: "center", gap: 10,
            transition: "box-shadow .35s, border-color .35s",
            boxSizing: "border-box", zIndex: 1,
          }}>
            <div style={{ width: 40, height: 40, flexShrink: 0 }}>
              <Image src={d.img} alt={d.id} width={40} height={40} style={{ objectFit: "contain" }} />
            </div>
            <div>
              <div style={{ font: "600 13px/1 var(--font-sans)", color: "#0a0a0a", marginBottom: 5 }}>{d.id}</div>
              <div style={{ font: "400 11.5px/1.3 var(--font-sans)", color: "rgba(10,10,10,.45)" }}>팀원 : {d.count}명</div>
            </div>
          </div>
        );
      })}

      {/* ── Bottom pill: AI NATIVE TEAM (h=44, y 297–341) ── */}
      <div style={{
        position: "absolute", top: py(297), left: "50%", transform: "translateX(-50%)",
        height: 44, borderRadius: 999, padding: "0 22px",
        whiteSpace: "nowrap", display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center", zIndex: 1,
        background: nativeOn ? "rgba(78,95,212,.08)" : "rgba(10,10,10,.04)",
        border: nativeOn ? "1.5px solid rgba(78,95,212,.3)" : "1.5px solid rgba(10,10,10,.1)",
        transition: "background .4s, border-color .4s",
        boxSizing: "border-box",
      }}>
        <div style={{ font: "800 13px/1 var(--font-sans)", color: nativeOn ? "#4e5fd4" : "#0a0a0a", letterSpacing: ".08em", transition: "color .4s" }}>
          AI NATIVE TEAM
        </div>
        <div style={{ font: "400 10px/1 var(--font-sans)", color: "rgba(10,10,10,.5)", marginTop: 4 }}>팀원 : 32명</div>
      </div>
    </div>
  );
}

function VisualMethod() {
  const ways = [
    { icon: "code", title: "코드", meta: "PYTHON · API · 룰 기반", tag: "결정적 접근", tagColor: "#A8E5FF", tagBg: "rgba(0,183,255,.18)", tagBorder: "rgba(0,183,255,.45)", active: false },
    { icon: "auto", title: "자동화", meta: "LLM · 단순 확률 판단", tag: "확률적 접근", tagColor: "#ffd070", tagBg: "rgba(255,176,74,.18)", tagBorder: "rgba(255,176,74,.55)", active: true },
    { icon: "agent", title: "에이전트", meta: "멀티스텝 · 복잡 추론", tag: "확률적 접근", tagColor: "#ffd070", tagBg: "rgba(255,176,74,.12)", tagBorder: "rgba(255,176,74,.4)", active: false },
  ];

  const Icon = ({ kind, active }: { kind: string; active: boolean }) => {
    const stroke = active ? "#ffb14a" : "#fff";
    if (kind === "code") return <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M9 8l-4 4 4 4M15 8l4 4-4 4M13 6l-2 12" stroke={stroke} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>;
    if (kind === "auto") return <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="3" stroke={stroke} strokeWidth="1.6"/><path d="M12 3v3M12 18v3M3 12h3M18 12h3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M5.6 18.4l2.1-2.1M16.3 7.7l2.1-2.1" stroke={stroke} strokeWidth="1.6" strokeLinecap="round"/></svg>;
    return <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><rect x="5" y="7" width="14" height="11" rx="2.5" stroke={stroke} strokeWidth="1.6"/><path d="M12 4v3" stroke={stroke} strokeWidth="1.6" strokeLinecap="round"/><circle cx="12" cy="3.5" r="1" fill={stroke}/><circle cx="9.5" cy="12" r="1.1" fill={stroke}/><circle cx="14.5" cy="12" r="1.1" fill={stroke}/><path d="M9 15.5h6" stroke={stroke} strokeWidth="1.4" strokeLinecap="round"/><path d="M3 12h2M19 12h2" stroke={stroke} strokeWidth="1.6" strokeLinecap="round"/></svg>;
  };

  const [t, setT] = useState(0);
  const [feedIdx, setFeedIdx] = useState(0);
  useEffect(() => {
    let raf: number, start = performance.now();
    const loop = (now: number) => { setT((now - start) / 1000); raf = requestAnimationFrame(loop); };
    raf = requestAnimationFrame(loop);
    const id = setInterval(() => setFeedIdx((i) => i + 1), 2200);
    return () => { cancelAnimationFrame(raf); clearInterval(id); };
  }, []);

  const counter = Math.round(403 + Math.sin(t * 0.7) * 14 + Math.sin(t * 1.9) * 6);
  const buildPath = (offset: number, amp: number, base: number) => {
    const N = 40, w = 300, step = w / (N - 1);
    let d = "";
    for (let i = 0; i < N; i++) {
      const x = i * step;
      const phase = i * 0.42 + t * 1.6 + offset;
      const y = base + Math.sin(phase) * amp + Math.sin(phase * 0.5 + 1.3) * amp * 0.45 + Math.sin(i * 0.22 + t * 0.7) * amp * 0.25;
      d += (i === 0 ? "M" : "L") + x.toFixed(1) + " " + y.toFixed(1) + " ";
    }
    return d.trim();
  };
  const sparkBlue = buildPath(0, 8, 38);
  const sparkOrange = buildPath(2.1, 6, 56);
  const cycle = (t % 6) / 6;
  const markerX = 60 + cycle * 200;
  const mPhase = (markerX / 300) * (40 - 1) * 0.42 + t * 1.6;
  const markerY = 38 + Math.sin(mPhase) * 8 + Math.sin(mPhase * 0.5 + 1.3) * 8 * 0.45 + Math.sin((markerX / 300) * (40 - 1) * 0.22 + t * 0.7) * 8 * 0.25;

  const allRows = [
    { dot: "#A8E5FF", label: "API · CRM sync", tag: "DET", tagColor: "#A8E5FF", tagBg: "rgba(0,183,255,.18)", tagBorder: "rgba(0,183,255,.45)" },
    { dot: "#ffb14a", label: "LLM · email draft", tag: "PROB", tagColor: "#ffd070", tagBg: "rgba(255,176,74,.12)", tagBorder: "rgba(255,176,74,.4)" },
    { dot: "#A8E5FF", label: "Agent · invoice classify", tag: "AUTO", tagColor: "#cfd2ff", tagBg: "rgba(15,18,26,.08)", tagBorder: "rgba(15,18,26,.22)" },
    { dot: "#ffb14a", label: "LLM · contract summarize", tag: "PROB", tagColor: "#ffd070", tagBg: "rgba(255,176,74,.12)", tagBorder: "rgba(255,176,74,.4)" },
    { dot: "#A8E5FF", label: "Agent · meeting digest", tag: "AUTO", tagColor: "#cfd2ff", tagBg: "rgba(15,18,26,.08)", tagBorder: "rgba(15,18,26,.22)" },
    { dot: "#A8E5FF", label: "API · Slack notify", tag: "DET", tagColor: "#A8E5FF", tagBg: "rgba(0,183,255,.18)", tagBorder: "rgba(0,183,255,.45)" },
  ];
  const visible = 3;
  const start = feedIdx % allRows.length;
  const activity = Array.from({ length: visible }, (_, i) => allRows[(start + i) % allRows.length]);

  return (
    <div style={{ width: "100%", maxWidth: 560, display: "flex", flexDirection: "column", gap: 14 }}>
      <style>{`@keyframes vmrowin{from{opacity:0;transform:translateY(-8px)}to{opacity:1;transform:translateY(0)}}`}</style>
      <div style={{ background: "rgba(255,255,255,.5)", border: "1px solid rgba(15,18,26,.14)", borderRadius: 16, padding: "16px 18px 22px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
          <div style={{ font: "500 12px/1 var(--font-sans)", color: "rgba(15,18,26,.7)" }}>Task architecture</div>
          <div style={{ font: "500 10.5px/1 var(--font-mono)", color: "rgba(15,18,26,.5)", letterSpacing: ".14em" }}>TYPE-BASED AX</div>
        </div>
        <div style={{ font: "500 10.5px/1 var(--font-mono)", letterSpacing: ".22em", color: "rgba(15,18,26,.55)", textAlign: "center", marginBottom: 10 }}>TYPE 기반 AX 설계</div>
        <div style={{ display: "flex", justifyContent: "center" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "#00B7FF", color: "#0f121a", padding: "7px 14px", borderRadius: 999, font: "600 12px/1 var(--font-sans)", letterSpacing: ".04em", boxShadow: "0 6px 16px rgba(0,183,255,.4)" }}>
            <span style={{ width: 5, height: 5, borderRadius: "50%", background: "#fff" }} />하나의 TASK
          </div>
        </div>
        <div style={{ position: "relative", height: 18, marginTop: 6 }}>
          <svg viewBox="0 0 300 18" preserveAspectRatio="none" style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}>
            <path d="M150 0 L150 9 L50 9 L50 18 M150 9 L150 18 M150 9 L250 9 L250 18" stroke="rgba(15,18,26,.18)" strokeWidth="1" fill="none"/>
            <circle cx="150" cy="6" r="1.6" fill="#A8E5FF"/>
          </svg>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginTop: 2 }}>
          {ways.map((w, i) => (
            <div key={i} style={{ background: w.active ? "rgba(255,176,74,.06)" : "rgba(255,255,255,.5)", border: w.active ? "1px solid rgba(255,176,74,.55)" : "1px solid rgba(15,18,26,.14)", borderRadius: 12, padding: "14px 8px 12px", display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
              <div style={{ width: 38, height: 38, borderRadius: "50%", background: w.active ? "rgba(255,176,74,.1)" : "rgba(15,18,26,.06)", border: w.active ? "1px solid rgba(255,176,74,.4)" : "1px solid rgba(15,18,26,.16)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Icon kind={w.icon} active={w.active} />
              </div>
              <div style={{ font: "600 13px/1 var(--font-sans)", color: "#0f121a", marginTop: 1 }}>{w.title}</div>
              <div style={{ font: "500 9px/1.3 var(--font-mono)", color: "rgba(15,18,26,.5)", letterSpacing: ".06em", textAlign: "center" }}>{w.meta}</div>
              <div style={{ marginTop: 4, padding: "3px 8px", borderRadius: 999, background: w.tagBg, border: `1px solid ${w.tagBorder}`, color: w.tagColor, font: "600 9.5px/1 var(--font-mono)", letterSpacing: ".08em" }}>{w.tag}</div>
            </div>
          ))}
        </div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
        <div style={{ background: "rgba(255,255,255,.5)", border: "1px solid rgba(15,18,26,.14)", borderRadius: 14, padding: "14px 14px 12px", display: "flex", flexDirection: "column", gap: 6, minHeight: 160 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ font: "500 12px/1 var(--font-sans)", color: "rgba(15,18,26,.7)" }}>Throughput</div>
            <div style={{ display: "flex", alignItems: "center", gap: 6, font: "500 9.5px/1 var(--font-mono)", color: "rgba(15,18,26,.5)", letterSpacing: ".14em" }}>
              <span style={{ width: 5, height: 5, borderRadius: "50%", background: "#6dd28a" }} />LIVE · 24H
            </div>
          </div>
          <div style={{ font: "500 9.5px/1 var(--font-mono)", color: "rgba(15,18,26,.4)", letterSpacing: ".12em", marginTop: 6 }}>TASKS / MIN</div>
          <div style={{ font: "600 26px/1 var(--font-sans)", color: "#0f121a", letterSpacing: "-.01em", fontVariantNumeric: "tabular-nums" }}>{counter}</div>
          <div style={{ flex: 1, position: "relative", marginTop: 4 }}>
            <svg viewBox="0 0 300 80" preserveAspectRatio="none" style={{ width: "100%", height: 64, display: "block" }}>
              <defs>
                <linearGradient id="vmblue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="rgba(124,140,255,.35)"/>
                  <stop offset="100%" stopColor="rgba(124,140,255,0)"/>
                </linearGradient>
              </defs>
              <path d={sparkBlue + " L300 80 L0 80 Z"} fill="url(#vmblue)"/>
              <path d={sparkBlue} stroke="#5DD3FF" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
              <path d={sparkOrange} stroke="#ffb14a" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
              <line x1={markerX} y1="0" x2={markerX} y2="80" stroke="rgba(15,18,26,.22)" strokeDasharray="2 3" strokeWidth="1"/>
              <circle cx={markerX} cy={markerY} r="3" fill="#fff" stroke="#5DD3FF" strokeWidth="1.5"/>
            </svg>
          </div>
        </div>
        <div style={{ background: "rgba(255,255,255,.5)", border: "1px solid rgba(15,18,26,.14)", borderRadius: 14, padding: "14px 14px 10px", display: "flex", flexDirection: "column", gap: 6, minHeight: 160 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ font: "500 12px/1 var(--font-sans)", color: "rgba(15,18,26,.7)" }}>Activity</div>
            <div style={{ font: "500 9.5px/1 var(--font-mono)", color: "rgba(15,18,26,.5)", letterSpacing: ".14em" }}>LIVE</div>
          </div>
          <div style={{ height: 8, opacity: .35, marginTop: 6, borderTop: "1px solid rgba(15,18,26,.06)" }} />
          <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 2, flex: 1 }}>
            {activity.map((a, i) => (
              <div key={a.label + i} style={{ display: "flex", alignItems: "center", gap: 8, font: "500 11.5px/1 var(--font-sans)", color: "rgba(15,18,26,.85)", animation: "vmrowin .45s ease-out both" }}>
                <span style={{ width: 6, height: 6, borderRadius: "50%", background: a.dot, flexShrink: 0 }} />
                <span style={{ flex: 1, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{a.label}</span>
                <span style={{ padding: "2px 6px", borderRadius: 5, background: a.tagBg, border: `1px solid ${a.tagBorder}`, color: a.tagColor, font: "600 9px/1 var(--font-mono)", letterSpacing: ".1em" }}>{a.tag}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function VisualProducts() {
  const prods = [
    { name: "POSTOO", tag: "IT 서비스 자동 기능명세 & 견적", bg: "#0F1424", fg: "#ffffff", mark: "P", markBg: "rgba(255,255,255,.12)" },
    { name: "pluuug", tag: "B2B 외주 관리 SaaS", bg: "#00B7FF", fg: "#0a0a0a", mark: "p", markBg: "rgba(10,10,10,.1)" },
  ];
  return (
    <div style={{ width: "100%", maxWidth: 520, display: "flex", flexDirection: "column", gap: 14 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", font: "600 12px/1 var(--font-sans)", color: "rgba(15,18,26,.55)" }}>
        <span>자체 서비스 2종 운영 중</span>
        <span style={{ display: "inline-flex", alignItems: "center", gap: 6, color: "#1ea659" }}>
          <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#1ea659" }} />Live
        </span>
      </div>
      {prods.map((p) => (
        <div key={p.name} style={{ background: "#fff", borderRadius: 16, border: "1px solid rgba(15,18,26,.06)", boxShadow: "0 2px 6px -2px rgba(15,18,26,.08)", overflow: "hidden", display: "flex", flexDirection: "column" }}>
          <div style={{ background: p.bg, color: p.fg, padding: "22px 22px", display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ width: 42, height: 42, borderRadius: 12, background: p.markBg, display: "grid", placeItems: "center", font: "700 22px/1 var(--font-sans)", color: p.fg }}>{p.mark}</div>
            <span style={{ font: "700 22px/1 var(--font-sans)", letterSpacing: "-.02em" }}>{p.name}</span>
          </div>
          <div style={{ padding: "12px 18px 14px", font: "500 13px/1.5 var(--font-sans)", color: "rgba(15,18,26,.65)" }}>{p.tag}</div>
        </div>
      ))}
    </div>
  );
}

function WhyVisual({ variant }: { variant: string }) {
  if (variant === "endtoend") return <VisualEndToEnd />;
  if (variant === "internalize") return <VisualInternalize />;
  if (variant === "method") return <VisualMethod />;
  if (variant === "products") return <VisualProducts />;
  return <VisualMethod />;
}

/* ======================== Main Component ======================== */

const cardBgs = [
  "linear-gradient(160deg,#eeeeff 0%,#f5eeff 35%,#fff3f8 65%,#ffffff 100%)",
  "radial-gradient(120% 95% at 22% 30%, #FFF9DC 0%, #F8F4E8 22%, #F2F2EE 50%, #DCE9F7 78%, #BFDBF5 100%)",
  "radial-gradient(120% 95% at 80% 22%, #D8F0A8 0%, #E6F4C2 28%, #EFF6DE 54%, #F2F2EC 78%, #ECECE6 100%)",
  "radial-gradient(120% 95% at 25% 25%, #BFE3FB 0%, #DCEDF8 28%, #EFF2F3 54%, #F4F1EA 78%, #F0E6D2 100%)",
];

const items = [
  { en: "프로덕트의 전체 흐름을 알고 있습니다", ko: "9년동안 직접 해온 경험", desc: "똑똑한개발자는 9년 동안 다양한 기업의 IT 프로덕트를 기획, 디자인, 개발, 런칭, 운영, 그로스까지 함께 만들어왔습니다. 비즈니스 흐름 안에서 어떤 업무를 빠르게 자동화해야 하는지, 어떤 지점부터 개선해야 효과가 나는지 함께 판단할 수 있습니다.", visual: "endtoend" },
  { en: "AX는 조직 안에 심어져야 합니다", ko: "교육 인프라와 팀 내재화", desc: "AI 도입은 툴을 지급하는 것으로 끝나지 않습니다. 팀원들이 실제 업무에서 쓸 수 있어야 하고, 조직의 운영 방식 안에 자연스럽게 연결되어야 합니다. 똑똑한개발자는 내부 전 팀이 AI와 함께 일하는 방식을 실험하고, 검증한 워크플로우와 교육 자산을 고객사에 맞게 적용합니다.", visual: "internalize" },
  { en: "이론이 아니라, 직접 작동시킨 방법입니다", ko: "먼저 설계하고 검증한 방법", desc: "똑똑한개발자는 외부 방법론을 그대로 가져오지 않습니다. 먼저 우리 조직의 일하는 방식을 AI 중심으로 재설계하고, 실제로 운영하며 검증한 뒤 고객사에 맞게 구조화합니다. 현장에서 작동하고 계속 고도화되는 AX를 만듭니다.", visual: "method" },
  { en: "서비스 런칭 이후의 흐름까지 봅니다", ko: "아웃소싱은 물론 자체 서비스 출시 및 고도화 경험", desc: "똑똑한개발자는 외주 개발뿐 아니라 자체 서비스도 직접 만들고 운영합니다. 서비스가 출시된 이후 사용자가 어떻게 움직이는지, 비즈니스가 어떻게 확장되는지까지 함께 보기 때문에 더 현실적인 AX 전략과 실행 방안을 제안할 수 있습니다.", visual: "products" },
];

export default function WhyToktok() {
  const [activeCard, setActiveCard] = useState(0);
  const [titleShift, setTitleShift] = useState(0);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

    const onScroll = () => {
      // Update active card
      const refs = cardRefs.current.filter(Boolean);
      if (refs.length) {
        const center = window.innerHeight * 0.5;
        let best = 0, bestDist = Infinity;
        refs.forEach((el, i) => {
          if (!el) return;
          const r = el.getBoundingClientRect();
          const mid = r.top + r.height / 2;
          const d = Math.abs(mid - center);
          if (d < bestDist) { bestDist = d; best = i; }
        });
        setActiveCard(best);
      }

      // Dark→light background dissolve
      const lastCard = cardRefs.current[cardRefs.current.length - 1];
      if (lastCard) {
        const r = lastCard.getBoundingClientRect();
        const vh = window.innerHeight;
        const startAt = 140;
        const dissolveRange = vh * 0.7;
        let t = (startAt - r.top) / dissolveRange;
        t = Math.max(0, Math.min(1, t));
        setTitleShift(Math.min(0, r.top - 120));
        const eased = t * t * (3 - 2 * t);
        const v = Math.round(lerp(10, 255, eased));
        document.body.style.background = `rgb(${v},${v},${v})`;
        document.documentElement.style.setProperty("--dissolve-progress", eased.toFixed(3));
        document.body.dataset.theme = eased > 0.5 ? "light" : "dark";
      }
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <section style={{ background: "transparent", color: "#fff", padding: "120px 24px 40px" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", display: "grid", gridTemplateColumns: "minmax(0, 320px) minmax(0, 1fr)", gap: 80, alignItems: "start" }}>
        {/* Sticky left title */}
        <div style={{ position: "sticky", top: 120, alignSelf: "start", transform: `translateY(${titleShift}px)`, willChange: "transform" }}>
          <h2 style={{ font: "700 clamp(28px,2.8vw,40px)/1.28 var(--font-sans)", letterSpacing: "-.025em", margin: 0, color: "#fff" }}>
            엔터프라이즈 AX에<br />똑똑한개발자가<br />맞는 이유
          </h2>
          <p style={{ marginTop: 20, font: "400 14.5px/1.7 var(--font-sans)", color: "rgba(255,255,255,.62)", margin: "20px 0 0" }}>
            엔터프라이즈 AX는 단순한 자동화나 툴 도입으로 해결되지 않습니다.<br />복잡한 요구사항, 기존 시스템, 조직별 업무 방식까지 이해해야<br />실제로 작동하는 AI 전환을 만들 수 있습니다.
          </p>
        </div>

        {/* Right: card rows */}
        <div style={{ display: "flex", flexDirection: "column", gap: 40 }}>
          {items.map((it, i) => {
            const isActive = i === activeCard;
            const isPin = i === items.length - 1;
            const rowStyle: CSSProperties = isPin
              ? { display: "grid", gridTemplateColumns: "minmax(0, 1fr) minmax(0, 360px)", gap: 56, alignItems: "start", position: "sticky", top: 120, background: "transparent", zIndex: 2 }
              : { display: "grid", gridTemplateColumns: "minmax(0, 1fr) minmax(0, 360px)", gap: 56, alignItems: "start" };
            return (
              <div key={it.en} ref={(el) => { cardRefs.current[i] = el; }} style={rowStyle}>
                <div style={{
                  background: cardBgs[i], borderRadius: 28, aspectRatio: "1 / 1.06",
                  padding: 32, display: "flex", alignItems: "center", justifyContent: "center",
                  overflow: "hidden", position: "relative",
                  transform: isActive ? "scale(1)" : "scale(0.9)", transformOrigin: "center center",
                  opacity: isActive ? 1 : 0.55, filter: isActive ? "none" : "saturate(.75)",
                  transition: "transform .5s cubic-bezier(.2,.7,.2,1), opacity .5s, filter .5s",
                }}>
                  {isActive && (
                    <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
                      <WhyVisual variant={it.visual} />
                    </div>
                  )}
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 16, paddingTop: 40 }}>
                  <h3 style={{ font: "700 clamp(22px,2vw,30px)/1.25 var(--font-sans)", letterSpacing: "-.02em", margin: 0, color: "#fff" }}>{it.en}</h3>
                  <p style={{ font: "400 14.5px/1.7 var(--font-sans)", color: "rgba(255,255,255,.62)", margin: 0, maxWidth: 320 }}>{it.desc}</p>
                  <a href="#contact" style={{ marginTop: 8, font: "500 13px/1 var(--font-sans)", color: "#fff", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 6, alignSelf: "flex-start" }}>자세히 보기 ›</a>
                </div>
              </div>
            );
          })}
          {/* Pin spacer */}
          <div aria-hidden="true" style={{ height: "50vh" }} />
        </div>
      </div>
    </section>
  );
}
