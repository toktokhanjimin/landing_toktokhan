
const logos = [
  { img: "/assets/clients/appsintoss.png", alt: "apps in toss" },
  { img: "/assets/clients/bluegarage.png", alt: "BLUE GARAGE" },
  { img: "/assets/clients/nhnacademy.png", alt: "NHN ACADEMY" },
  { img: "/assets/clients/woowa.png", alt: "우아한형제들" },
  { img: "/assets/clients/kakao.png", alt: "kakao" },
  { img: "/assets/clients/tmoney.png", alt: "Tmoney" },
  { img: "/assets/clients/kt.png", alt: "kt" },
  { img: "/assets/clients/hanssem.png", alt: "HANSSEM" },
  { img: "/assets/clients/hhi.png", alt: "현대중공업" },
  { img: "/assets/clients/aerok.png", alt: "Aero_K" },
  { img: "/assets/clients/skbio.png", alt: "SK 바이오팜" },
  { img: "/assets/clients/asiana.png", alt: "아시아나 IDT" },
  { img: "/assets/clients/millie.png", alt: "Millie" },
  { img: "/assets/clients/kyobo.png", alt: "KYOBO" },
  { img: "/assets/clients/kmong.png", alt: "kmong" },
  { img: "/assets/clients/riiid.png", alt: "Riiid" },
  { img: "/assets/clients/sm.png", alt: "SM ENTERTAINMENT" },
  { img: "/assets/clients/krafton.png", alt: "KRAFTON" },
  { img: "/assets/clients/shinhan.png", alt: "신한은행" },
  { img: "/assets/clients/nice.png", alt: "NICE 정보통신" },
  { img: "/assets/clients/linegames.png", alt: "LINE GAMES" },
  { img: "/assets/clients/fastfive.png", alt: "FASTFIVE" },
  { img: "/assets/clients/ksoe.png", alt: "KSOE 한국조선해양" },
];

const mid = Math.ceil(logos.length / 2);
const row1 = logos.slice(0, mid);
const row2 = logos.slice(mid);

const MASK = "linear-gradient(90deg, transparent, #000 8%, #000 92%, transparent)";

function LogoRow({ items, duration, reverse }: { items: typeof logos; duration: string; reverse?: boolean }) {
  const anim = reverse ? `clientsMarqueeR ${duration} linear infinite` : `clientsMarquee ${duration} linear infinite`;
  // 2카피만 사용, -50% = 정확히 카피 1개 너비
  const renderItems = (keyOffset: number) => items.map((l, i) => (
    <div key={keyOffset + i} style={{ flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", height: 52, width: 120, marginRight: 56 }}>
      <img src={l.img} alt={l.alt} style={{ maxWidth: 120, maxHeight: 52, width: "auto", height: "auto", display: "block" }} />
    </div>
  ));
  return (
    <div style={{ overflow: "hidden", maskImage: MASK, WebkitMaskImage: MASK }}>
      <div style={{ display: "flex", width: "max-content", animation: anim, alignItems: "center" }}>
        {renderItems(0)}
        {renderItems(1000)}
      </div>
    </div>
  );
}

export default function Clients() {
  return (
    <section style={{ background: "transparent", color: "var(--fg-1)", padding: "60px 0" }}>
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes clientsMarquee {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }
        @keyframes clientsMarqueeR {
          from { transform: translateX(-50%); }
          to   { transform: translateX(0); }
        }
      ` }} />

      <div style={{ maxWidth: 1200, margin: "0 auto 56px", textAlign: "center", padding: "0 24px" }}>
        <h2 className="section-title" style={{ margin: "0 auto", maxWidth: 720, color: "var(--fg-1)" }}>
          다양한 기업의 복잡한 문제를<br />함께 해결해왔습니다
        </h2>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
        <LogoRow items={row1} duration="55s" />
        <LogoRow items={row2} duration="65s" reverse />
      </div>
    </section>
  );
}
