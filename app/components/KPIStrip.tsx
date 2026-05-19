"use client";

import { useRef, useState, useEffect } from "react";

function CountUp({ prefix, value, suffix, duration = 900 }: { prefix: string; value: number; suffix: string; duration?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [n, setN] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || done) return;
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting && !done) {
          setDone(true);
          const start = performance.now();
          const tick = (t: number) => {
            const p = Math.min(1, (t - start) / duration);
            const eased = 1 - Math.pow(1 - p, 3);
            setN(value * eased);
            if (p < 1) requestAnimationFrame(tick);
            else setN(value);
          };
          requestAnimationFrame(tick);
        }
      });
    }, { threshold: 0.5 });
    io.observe(el);
    return () => io.disconnect();
  }, [done, value, duration]);

  const display = suffix === "×" ? n.toFixed(1) : Math.round(n);
  return <span ref={ref}>{prefix}{display}{suffix}</span>;
}

const kpis = [
  { prefix: "−", value: 42, suffix: "%", tail: "제안서 작성 시간이 줄었어요", line2: ["리드 정리·견적·초안까지", "AI가 먼저 만들어둬요"], part: "영업 파트" },
  { prefix: "", value: 3, suffix: "배", tail: "지원자 검토 속도가 빨라졌어요", line2: ["이력서 스크리닝과 일정 조율을", "자동으로 처리해요"], part: "HR 파트" },
  { prefix: "−", value: 60, suffix: "%", tail: "스펙 정리 시간이 줄었어요", line2: ["회의록에서 티켓·리포트가", "바로 정리돼요"], part: "PM 파트" },
  { prefix: "+", value: 45, suffix: "%", tail: "1차 응대를 AI가 먼저 처리해요", line2: ["반복 문의와 백오피스 작업을", "미리 해결해둬요"], part: "운영 파트" },
];

export default function KPIStrip() {
  const wrapRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    el.style.setProperty("padding-bottom", "0px", "important");
    el.style.setProperty("padding-top", "100px", "important");
  }, []);

  return (
    <section ref={wrapRef} style={{ position: "relative", background: "transparent", color: "#0a0a0a", padding: "100px 24px 0", overflow: "hidden" }}>
      <div style={{ position: "relative", maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ textAlign: "left", marginBottom: 88, maxWidth: 720 }}>
          <h2 style={{ font: "700 clamp(26px,2.8vw,42px)/1.24 var(--font-sans)", letterSpacing: "-.02em", margin: 0 }}>
            우리 조직에 먼저 적용해봤어요.
          </h2>
          <p style={{ marginTop: 20, font: "400 15px/1.65 var(--font-sans)", color: "rgba(10,10,10,.6)", maxWidth: 560 }}>
            고객사에 권하기 전에, 똑똑한개발자 각 파트가 직접 AX를 도입했어요.<br />
            아래는 도입 전후 6개월간 측정한 실제 변화예요.
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 40 }}>
          {kpis.map((k) => (
            <div key={k.part} style={{ display: "flex", flexDirection: "column" }}>
              <div style={{ font: "600 clamp(36px,3.6vw,52px)/1 var(--font-sans)", letterSpacing: "-.03em", color: "#0a0a0a", marginBottom: 16, fontVariantNumeric: "tabular-nums" }}>
                <CountUp prefix={k.prefix} value={k.value} suffix={k.suffix} />
              </div>
              <div style={{ font: "600 clamp(16px,1.2vw,18px)/1.4 var(--font-sans)", letterSpacing: "-.01em", color: "#0a0a0a", marginBottom: 10 }}>{k.tail}</div>
              <div style={{ font: "400 14px/1.6 var(--font-sans)", color: "rgba(10,10,10,.5)" }}>
                {k.line2[0]}<br />{k.line2[1]}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
