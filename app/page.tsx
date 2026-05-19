"use client";

import { useEffect } from "react";
import SiteHeader from "./components/SiteHeader";
import Hero from "./components/Hero";
import PortfolioWall from "./components/PortfolioWall";
import AXDefinition from "./components/AXDefinition";
import Services from "./components/Services";
import WhyToktok from "./components/WhyToktok";
import KPIStrip from "./components/KPIStrip";
import TeamReveal from "./components/TeamReveal";
import WorkGrid from "./components/WorkGrid";
import Clients from "./components/Clients";
import AIInsights from "./components/AIInsights";
import FAQ from "./components/FAQ";
import Footer from "./components/Footer";

export default function Home() {
  // Framer-style reveal on scroll
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((en) => {
          if (en.isIntersecting) {
            en.target.classList.add("in");
            io.unobserve(en.target);
          }
        });
      },
      { threshold: 0.1 }
    );
    document.querySelectorAll("[data-screen-label]").forEach((el) => {
      if (el.hasAttribute("data-no-reveal")) return;
      el.classList.add("reveal");
      io.observe(el);
    });
    return () => io.disconnect();
  }, []);

  return (
    <>
      <SiteHeader />
      <div data-screen-label="00 Hero">
        <Hero />
      </div>
      <div data-screen-label="00b Portfolio Wall" data-no-reveal>
        <PortfolioWall />
      </div>
      <div data-screen-label="01 AX Definition">
        <AXDefinition />
      </div>
      <div data-screen-label="02 Services">
        <Services />
      </div>
<div data-screen-label="02b Why Toktok" data-no-reveal>
        <WhyToktok />
      </div>
      <div data-screen-label="03 KPI">
        <KPIStrip />
      </div>
      <div data-screen-label="03b Team Reveal" data-no-reveal>
        <TeamReveal />
      </div>
      <div data-screen-label="04 Work">
        <WorkGrid />
      </div>
      <div data-screen-label="05 Clients">
        <Clients />
      </div>
      <div data-screen-label="07 Insights">
        <AIInsights />
      </div>
      <div data-screen-label="08 FAQ">
        <FAQ />
      </div>
      <div data-screen-label="09 Footer">
        <Footer />
      </div>
    </>
  );
}
