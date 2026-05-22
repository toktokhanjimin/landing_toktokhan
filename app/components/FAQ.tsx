"use client";

import Button from "./ui/Button";
import StickyActionButton from "./StickyActionButton";

export default function FAQ() {
  return (
    <section style={{ background: "transparent", color: "var(--fg-1)", padding: "80px 24px 150px" }} id="contact-cta">
      <div style={{ maxWidth: 980, margin: "0 auto", display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", gap: 20 }}>
        <h2 className="section-title">
          AI와 일하는 조직<br />똑똑하게 시작하세요
        </h2>
        <p style={{ font: "var(--body-md)", color: "rgba(10,10,10,.6)", margin: 0, maxWidth: 560 }}>
          우리 팀 상황에 맞는 첫걸음을 똑똑한개발자와 함께 설계해보세요.
        </p>
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap", justifyContent: "center", marginTop: 8 }}>
          <Button variant="primary" href="#contact" onClick={(e) => { e.preventDefault(); window.dispatchEvent(new CustomEvent("open-contact")); }}>
            프로젝트 문의하기
          </Button>
          <Button variant="outline" href="/faq">
            자주 묻는 질문 보기
          </Button>
        </div>
        <StickyActionButton variant="inline" />
      </div>
    </section>
  );
}
