"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getWork, getInsights, getFAQs } from "../lib/store";

export default function AdminDashboard() {
  const [counts, setCounts] = useState({ work: 0, insights: 0, faqs: 0 });

  useEffect(() => {
    setCounts({
      work: getWork().length,
      insights: getInsights().length,
      faqs: getFAQs().length,
    });
  }, []);

  const cards = [
    { label: "포트폴리오", count: counts.work, href: "/admin/work", color: "#0a0a0a" },
    { label: "인사이트", count: counts.insights, href: "/admin/insight", color: "#0a0a0a" },
    { label: "FAQ", count: counts.faqs, href: "/admin/faq", color: "#0a0a0a" },
  ];

  return (
    <div>
      <h1 style={{
        font: "700 28px/1.2 var(--font-sans, sans-serif)",
        letterSpacing: "-.02em",
        color: "#0a0a0a",
        margin: "0 0 8px",
      }}>
        대시보드
      </h1>
      <p style={{
        font: "400 14px/1.5 var(--font-sans, sans-serif)",
        color: "rgba(10,10,10,.5)",
        margin: "0 0 40px",
      }}>
        콘텐츠 현황을 한눈에 확인하세요.
      </p>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20 }}>
        {cards.map((card) => (
          <Link
            key={card.href}
            href={card.href}
            style={{ textDecoration: "none", color: "inherit" }}
          >
            <div style={{
              background: "#fff",
              border: "1px solid rgba(10,10,10,.08)",
              borderRadius: 12,
              padding: "32px 28px",
              cursor: "pointer",
              transition: "box-shadow .15s ease",
            }}>
              <div style={{
                font: "400 13px/1 var(--font-sans, sans-serif)",
                color: "rgba(10,10,10,.5)",
                letterSpacing: ".04em",
                marginBottom: 16,
              }}>
                {card.label}
              </div>
              <div style={{
                font: "700 40px/1 var(--font-sans, sans-serif)",
                color: card.color,
                letterSpacing: "-.03em",
              }}>
                {card.count}
              </div>
              <div style={{
                font: "400 12px/1 var(--font-sans, sans-serif)",
                color: "rgba(10,10,10,.4)",
                marginTop: 8,
              }}>
                개의 콘텐츠
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
