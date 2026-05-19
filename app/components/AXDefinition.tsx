export default function AXDefinition() {
  return (
    <section style={{ background: "transparent", color: "#fff", padding: "120px 24px 60px" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1.1fr", gap: 80, alignItems: "start" }}>
        <div>
          <h2 style={{ font: "700 clamp(26px,2.8vw,42px)/1.31 var(--font-sans)", letterSpacing: "-.02em", margin: 0 }}>
            똑똑한 AX,<br />조직의 일하는 방식을<br />다시 짜는 일
          </h2>
        </div>
        <div>
          <p style={{ font: "400 16px/1.7 var(--font-sans)", color: "rgba(255,255,255,.62)", maxWidth: 520, margin: 0 }}>
            AI를 지금 하는 일 위에 그냥 올리는 게 아니에요. 일을 잘게 나누고, 단계마다 AI 역할을 따로 두어 사람과 AI가 같이 일하는 구조로 다시 짜는 일이에요.<br /><br />
            똑똑한개발자는 이 변화를 먼저 조직 안에서 해봤어요. 우리가 먼저 설계하고, 운영하고, 직접 써본 뒤에 고객의 조직에 적용해요.
          </p>
          <a style={{ display: "inline-flex", alignItems: "center", gap: 6, marginTop: 28, font: "500 14px/1 var(--font-sans)", color: "#fff", borderBottom: "1px solid rgba(255,255,255,.25)", paddingBottom: 6, cursor: "pointer", visibility: "hidden" }}>
            AX 만드는 방법 자세히 보기 →
          </a>
        </div>
      </div>
    </section>
  );
}
