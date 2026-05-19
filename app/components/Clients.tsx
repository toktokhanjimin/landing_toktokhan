const logos = [
  { img: "/assets/clients/appsintoss.png", alt: "apps in toss" },
  { img: "/assets/clients/bluegarage.png", alt: "BLUE GARAGE" },
  { img: "/assets/clients/nhnacademy.png", alt: "NHN ACADEMY" },
  { img: "/assets/clients/kinkos.png", alt: "kinko's" },
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
  const loop = [...items, ...items];
  const anim = reverse ? `clientsMarqueeR ${duration} linear infinite` : `clientsMarquee ${duration} linear infinite`;
  return (
    <div style={{ overflow: "hidden", maskImage: MASK, WebkitMaskImage: MASK }}>
      <div style={{ display: "flex", gap: 56, width: "max-content", animation: anim, alignItems: "center" }}>
        {loop.map((l, i) => (
          <div key={i} style={{ flexShrink: 0, display: "inline-flex", alignItems: "center", height: 52 }}>
            <img src={l.img} alt={l.alt} style={{ height: 38, width: "auto", objectFit: "contain", display: "block" }} />
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Clients() {
  return (
    <section style={{ background: "transparent", color: "#0a0a0a", padding: "120px 0" }}>
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes clientsMarqueeR {
          from { transform: translateX(-50%); }
          to   { transform: translateX(0); }
        }
      ` }} />

      <div style={{ maxWidth: 1200, margin: "0 auto 56px", textAlign: "center", padding: "0 24px" }}>
        <h2 style={{ font: "700 clamp(26px,2.8vw,42px)/1.24 var(--font-sans)", letterSpacing: "-.02em", margin: "0 auto", maxWidth: 720, color: "#0a0a0a" }}>
          다양한 고객과 일하며 쌓은<br />AX 노하우로, 기업 맞춤 컨설팅을 해요
        </h2>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
        <LogoRow items={row1} duration="55s" />
        <LogoRow items={row2} duration="65s" reverse />
      </div>
    </section>
  );
}
