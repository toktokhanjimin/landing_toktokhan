"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ReactNode } from "react";

const NAV_ITEMS = [
  { label: "대시보드", href: "/admin" },
  { label: "포트폴리오", href: "/admin/work" },
  { label: "인사이트", href: "/admin/insight" },
  { label: "FAQ", href: "/admin/faq" },
];

export default function AdminLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  return (
    <div style={{ display: "flex", minHeight: "100dvh", fontFamily: "var(--font-sans, sans-serif)" }}>
      {/* Sidebar */}
      <aside style={{
        width: 240,
        flexShrink: 0,
        background: "#f5f5f5",
        borderRight: "1px solid rgba(10,10,10,.08)",
        display: "flex",
        flexDirection: "column",
        position: "fixed",
        top: 0,
        left: 0,
        height: "100dvh",
        zIndex: 100,
      }}>
        {/* Logo */}
        <div style={{
          padding: "28px 24px 24px",
          borderBottom: "1px solid rgba(10,10,10,.08)",
        }}>
          <span style={{
            font: "700 15px/1 var(--font-sans, sans-serif)",
            letterSpacing: ".1em",
            color: "#0a0a0a",
          }}>
            TOKTOKHAN
          </span>
          <div style={{
            font: "400 11px/1 var(--font-sans, sans-serif)",
            color: "rgba(10,10,10,.45)",
            marginTop: 6,
            letterSpacing: ".04em",
          }}>
            Admin CMS
          </div>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: "16px 12px", display: "flex", flexDirection: "column", gap: 4 }}>
          {NAV_ITEMS.map((item) => {
            const isActive = item.href === "/admin"
              ? pathname === "/admin"
              : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                style={{
                  display: "block",
                  padding: "10px 12px",
                  borderRadius: 8,
                  font: `${isActive ? 600 : 400} 14px/1 var(--font-sans, sans-serif)`,
                  color: isActive ? "#0a0a0a" : "rgba(10,10,10,.6)",
                  background: isActive ? "rgba(10,10,10,.06)" : "transparent",
                  textDecoration: "none",
                  transition: "background .15s ease, color .15s ease",
                }}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Bottom actions */}
        <div style={{ padding: "16px 12px", borderTop: "1px solid rgba(10,10,10,.08)", display: "flex", flexDirection: "column", gap: 4 }}>
          <Link
            href="/"
            style={{
              display: "block",
              padding: "10px 12px",
              borderRadius: 8,
              font: "400 13px/1 var(--font-sans, sans-serif)",
              color: "rgba(10,10,10,.5)",
              textDecoration: "none",
            }}
          >
            ← 사이트로
          </Link>
          <button
            onClick={handleLogout}
            style={{
              display: "block",
              width: "100%",
              padding: "10px 12px",
              borderRadius: 8,
              font: "400 13px/1 var(--font-sans, sans-serif)",
              color: "rgba(10,10,10,.45)",
              background: "transparent",
              border: "none",
              cursor: "pointer",
              textAlign: "left",
            }}
          >
            로그아웃
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main style={{
        flex: 1,
        marginLeft: 240,
        background: "#f5f5f5",
        minHeight: "100dvh",
        padding: "40px",
      }}>
        {children}
      </main>
    </div>
  );
}
