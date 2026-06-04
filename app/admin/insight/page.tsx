"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import type { InsightItem } from "../../lib/store";
import { btnBase } from "../adminStyles";

async function deleteStorageImage(url: string) {
  if (!url?.startsWith("http")) return;
  await fetch("/api/admin/storage", {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ url, bucket: "insight-images" }),
  });
}

function Toggle({ on, onChange }: { on: boolean; onChange: () => void }) {
  return (
    <button
      onClick={onChange}
      title={on ? "노출 중 (클릭 시 미노출)" : "미노출 (클릭 시 노출)"}
      style={{
        position: "relative",
        width: 44,
        height: 24,
        borderRadius: 12,
        background: on ? "#0a0a0a" : "rgba(10,10,10,.15)",
        border: "none",
        cursor: "pointer",
        transition: "background .2s",
        flexShrink: 0,
        padding: 0,
      }}
    >
      <span style={{
        position: "absolute",
        top: 3,
        left: on ? 23 : 3,
        width: 18,
        height: 18,
        borderRadius: "50%",
        background: "#fff",
        transition: "left .2s",
        boxShadow: "0 1px 3px rgba(0,0,0,.2)",
        display: "block",
      }} />
    </button>
  );
}

export default function AdminInsightPage() {
  const router = useRouter();
  const [items, setItems] = useState<InsightItem[]>([]);

  useEffect(() => {
    fetch("/api/admin/insight").then((r) => r.json()).then(setItems).catch(console.error);
  }, []);

  async function handleDelete(item: InsightItem) {
    if (!confirm("정말 삭제하시겠어요?")) return;
    if (item.thumbImg?.startsWith("http")) await deleteStorageImage(item.thumbImg);
    await fetch(`/api/admin/insight/${item.id}`, { method: "DELETE" });
    setItems((prev) => prev.filter((it) => it.id !== item.id));
  }

  async function toggleFeatured(item: InsightItem) {
    const next = !item.featured;
    setItems((prev) => prev.map((it) => it.id === item.id ? { ...it, featured: next } : it));
    await fetch(`/api/admin/insight/${item.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ featured: next }),
    });
  }

  const visibleCount = items.filter((i) => i.featured).length;

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 28 }}>
        <div>
          <h1 style={{ font: "700 24px/1.2 var(--font-sans, sans-serif)", letterSpacing: "-.02em", color: "#0a0a0a", margin: "0 0 6px" }}>인사이트</h1>
          <p style={{ font: "400 13px/1 var(--font-sans, sans-serif)", color: "rgba(10,10,10,.45)", margin: 0 }}>
            전체 {items.length}개 · 노출 {visibleCount}개
          </p>
        </div>
        <button
          onClick={() => router.push("/admin/insight/new")}
          style={{ ...btnBase, background: "#0a0a0a", color: "#fff", padding: "10px 18px" }}
        >
          + 새 글쓰기
        </button>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {items.map((item) => (
          <div
            key={item.id}
            style={{
              background: "#fff",
              border: "1px solid rgba(10,10,10,.08)",
              borderRadius: 12,
              padding: "14px 20px",
              display: "flex",
              alignItems: "center",
              gap: 16,
              opacity: item.featured ? 1 : 0.5,
              transition: "opacity .2s",
            }}
          >
            {/* 썸네일 */}
            <div style={{ width: 48, height: 48, borderRadius: 8, background: item.thumb, flexShrink: 0, overflow: "hidden" }}>
              {item.thumbImg && <img src={item.thumbImg} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />}
            </div>

            {/* 텍스트 */}
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ font: "600 14px/1.3 var(--font-sans, sans-serif)", color: "#0a0a0a", marginBottom: 4, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {item.title}
              </div>
              <div style={{ font: "400 12px/1 var(--font-sans, sans-serif)", color: "rgba(10,10,10,.45)", display: "flex", gap: 8, alignItems: "center" }}>
                <span>{item.tag} · {item.date}</span>
                {item.body && item.body !== "<p></p>" && (
                  <span style={{ padding: "2px 6px", borderRadius: 4, background: "rgba(73,80,255,.1)", color: "#3a41d9", font: "500 11px/1 var(--font-sans, sans-serif)" }}>본문 있음</span>
                )}
              </div>
            </div>

            {/* 액션 */}
            <div style={{ display: "flex", gap: 12, flexShrink: 0, alignItems: "center" }}>
              {/* 노출 토글 */}
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ font: "500 12px/1 var(--font-sans, sans-serif)", color: item.featured ? "#0a0a0a" : "rgba(10,10,10,.35)", minWidth: 28 }}>
                  {item.featured ? "노출" : "미노출"}
                </span>
                <Toggle on={item.featured ?? false} onChange={() => toggleFeatured(item)} />
              </div>

              <div style={{ width: 1, height: 16, background: "rgba(10,10,10,.1)" }} />

              <button
                onClick={() => router.push(`/admin/insight/${item.id}`)}
                style={{ ...btnBase, background: "transparent", color: "#0a0a0a", border: "1px solid rgba(10,10,10,.2)" }}
              >
                수정
              </button>
              <button
                onClick={() => handleDelete(item)}
                style={{ ...btnBase, background: "transparent", color: "#e53e3e", border: "1px solid rgba(229,62,62,.3)" }}
              >
                삭제
              </button>
            </div>
          </div>
        ))}

        {items.length === 0 && (
          <div style={{ background: "#fff", border: "1px solid rgba(10,10,10,.08)", borderRadius: 12, padding: "40px", textAlign: "center", font: "400 14px/1 var(--font-sans, sans-serif)", color: "rgba(10,10,10,.35)" }}>
            콘텐츠가 없어요. 새 글쓰기로 추가해보세요.
          </div>
        )}
      </div>
    </div>
  );
}
