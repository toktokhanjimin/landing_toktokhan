export default function AXDefinition() {
  return (
    <section className="axd-section" style={{ background: "transparent", color: "var(--fg-on-dark-1)", padding: "120px 24px 60px" }}>
      <div className="axd-inner" style={{ maxWidth: 1200, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1.1fr", gap: 80, alignItems: "start" }}>
        <div>
          <h2 className="section-title">
            똑똑한 AX,<br />조직의 일하는 방식을<br />다시 짜는 일
          </h2>
        </div>
        <div>
          <p style={{ font: "var(--body-md)", color: "rgba(255,255,255,.62)", maxWidth: 520, margin: 0 }}>
            AX는 AI 도구를 하나 더 도입하는 일이 아닙니다.<br />업무 흐름을 진단하고, 사람이 해야 할 일과 AI가 맡아야 할 일을 다시 나누고,<br />조직 안에서 실제로 작동하는 방식으로 정착시키는 일입니다.<br /><br />
            똑똑한개발자는 설계 → 운영 → 검증의 사이클을 반복하며<br />각 조직에 맞는 AI 기반 업무 방식을 함께 만들어갑니다.
          </p>
          <a style={{ display: "inline-flex", alignItems: "center", gap: 6, marginTop: 28, font: "500 14px/1 var(--font-sans)", color: "var(--fg-on-dark-1)", borderBottom: "1px solid rgba(255,255,255,.25)", paddingBottom: 6, cursor: "pointer", visibility: "hidden" }}>
            AX 만드는 방법 자세히 보기 →
          </a>
        </div>
      </div>
    </section>
  );
}
