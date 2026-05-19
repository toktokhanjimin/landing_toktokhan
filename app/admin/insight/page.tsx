"use client";

import { useState, useEffect, CSSProperties } from "react";
import { getInsights, saveInsights, InsightItem } from "../../lib/store";

const CATEGORY_CONFIG: Record<string, { thumb: string; img?: string }> = {
  log:   { thumb: "linear-gradient(135deg,#34D399,#059669)", img: "/assets/log.png" },
  talk:  { thumb: "linear-gradient(135deg,#8B5CF6,#3B82F6)", img: "/assets/talk.png" },
  tech:  { thumb: "linear-gradient(135deg,#38BDF8,#6366F1)", img: "/assets/tech.png" },
  other: { thumb: "linear-gradient(135deg,#1a1d24,#0a0a0a)" },
};

const EMPTY_ITEM: InsightItem = {
  mark: "",
  markColor: "#0a0a0a",
  thumb: CATEGORY_CONFIG.log.thumb,
  thumbImg: CATEGORY_CONFIG.log.img,
  title: "",
  tag: "기술 블로그",
  category: "log",
  date: "",
  excerpt: "",
  url: "",
  featured: false,
};

const overlayStyle: CSSProperties = {
  position: "fixed",
  inset: 0,
  background: "rgba(0,0,0,.45)",
  zIndex: 200,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: 24,
};

const panelStyle: CSSProperties = {
  background: "#fff",
  border: "1px solid rgba(10,10,10,.08)",
  borderRadius: 12,
  width: "100%",
  maxWidth: 600,
  maxHeight: "90dvh",
  overflowY: "auto",
  padding: "32px 28px",
};

const inputStyle: CSSProperties = {
  width: "100%",
  font: "400 14px/1.5 var(--font-sans, sans-serif)",
  padding: "10px 12px",
  border: "1px solid rgba(10,10,10,.14)",
  borderRadius: 8,
  color: "#0a0a0a",
  background: "#fff",
  outline: "none",
  boxSizing: "border-box",
};

const labelStyle: CSSProperties = {
  font: "500 12px/1 var(--font-sans, sans-serif)",
  color: "rgba(10,10,10,.6)",
  letterSpacing: ".04em",
  marginBottom: 6,
  display: "block",
};

const btnBase: CSSProperties = {
  font: "500 13px/1 var(--font-sans, sans-serif)",
  padding: "8px 14px",
  borderRadius: 7,
  cursor: "pointer",
  border: "none",
};

function compressImage(file: File, maxSize = 360, quality = 0.92): Promise<string> {
  return new Promise((resolve) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      const scale = Math.min(1, maxSize / Math.max(img.width, img.height));
      const w = Math.round(img.width * scale);
      const h = Math.round(img.height * scale);
      const canvas = document.createElement("canvas");
      canvas.width = w;
      canvas.height = h;
      canvas.getContext("2d")!.drawImage(img, 0, 0, w, h);
      URL.revokeObjectURL(url);
      resolve(canvas.toDataURL("image/jpeg", quality));
    };
    img.src = url;
  });
}

export default function AdminInsightPage() {
  const [items, setItems] = useState<InsightItem[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingIdx, setEditingIdx] = useState<number | null>(null);
  const [form, setForm] = useState<InsightItem>(EMPTY_ITEM);

  useEffect(() => {
    setItems(getInsights());
  }, []);

  function openAdd() {
    setEditingIdx(null);
    setForm(EMPTY_ITEM);
    setModalOpen(true);
  }

  function openEdit(idx: number) {
    setEditingIdx(idx);
    setForm({ ...items[idx] });
    setModalOpen(true);
  }

  function closeModal() {
    setModalOpen(false);
    setEditingIdx(null);
  }

  function handleSave() {
    let updated: InsightItem[];
    if (editingIdx !== null) {
      updated = items.map((it, i) => (i === editingIdx ? form : it));
    } else {
      updated = [form, ...items];
    }
    saveInsights(updated);
    setItems(updated);
    closeModal();
  }

  function handleDelete(idx: number) {
    if (!confirm("정말 삭제하시겠어요?")) return;
    const updated = items.filter((_, i) => i !== idx);
    saveInsights(updated);
    setItems(updated);
  }

  function toggleFeatured(idx: number) {
    const updated = items.map((it, i) =>
      i === idx ? { ...it, featured: !it.featured } : it
    );
    saveInsights(updated);
    setItems(updated);
  }

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 28 }}>
        <div>
          <h1 style={{ font: "700 24px/1.2 var(--font-sans, sans-serif)", letterSpacing: "-.02em", color: "#0a0a0a", margin: "0 0 4px" }}>
            인사이트
          </h1>
          <p style={{ font: "400 13px/1 var(--font-sans, sans-serif)", color: "rgba(10,10,10,.45)", margin: 0 }}>
            {items.length}개의 아티클
          </p>
        </div>
        <button
          onClick={openAdd}
          style={{ ...btnBase, background: "#0a0a0a", color: "#fff", padding: "10px 18px" }}
        >
          + 추가
        </button>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {items.map((item, idx) => (
          <div
            key={idx}
            style={{
              background: "#fff",
              border: "1px solid rgba(10,10,10,.08)",
              borderRadius: 12,
              padding: "16px 20px",
              display: "flex",
              alignItems: "center",
              gap: 16,
            }}
          >
            {/* Thumb */}
            <div style={{
              width: 52,
              height: 52,
              borderRadius: 10,
              background: item.thumb,
              flexShrink: 0,
              overflow: "hidden",
            }}>
              {item.thumbImg && (
                <img src={item.thumbImg} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
              )}
            </div>

            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{
                font: "600 14px/1.3 var(--font-sans, sans-serif)",
                color: "#0a0a0a",
                marginBottom: 4,
                whiteSpace: "pre-line",
              }}>
                {item.title}
              </div>
              <div style={{
                font: "400 12px/1 var(--font-sans, sans-serif)",
                color: "rgba(10,10,10,.45)",
                display: "flex",
                gap: 8,
                alignItems: "center",
              }}>
                <span>{item.tag} · {item.date}</span>
                {item.url && (
                  <span style={{
                    font: "500 11px/1 var(--font-sans, sans-serif)",
                    padding: "2px 6px",
                    borderRadius: 4,
                    background: "rgba(0,183,255,.1)",
                    color: "#0077aa",
                  }}>
                    링크 연결됨
                  </span>
                )}
              </div>
            </div>

            <div style={{ display: "flex", gap: 8, flexShrink: 0, alignItems: "center" }}>
              <button
                onClick={() => toggleFeatured(idx)}
                style={{
                  ...btnBase,
                  background: item.featured ? "#0a0a0a" : "transparent",
                  color: item.featured ? "#fff" : "rgba(10,10,10,.4)",
                  border: item.featured ? "1px solid #0a0a0a" : "1px solid rgba(10,10,10,.15)",
                  padding: "5px 10px",
                  font: "500 11px/1 var(--font-sans, sans-serif)",
                }}
              >
                {item.featured ? "메인 노출" : "미노출"}
              </button>
              <button
                onClick={() => openEdit(idx)}
                style={{ ...btnBase, background: "transparent", color: "#0a0a0a", border: "1px solid rgba(10,10,10,.2)" }}
              >
                수정
              </button>
              <button
                onClick={() => handleDelete(idx)}
                style={{ ...btnBase, background: "transparent", color: "#e53e3e", border: "1px solid #e53e3e" }}
              >
                삭제
              </button>
            </div>
          </div>
        ))}
        {items.length === 0 && (
          <div style={{
            background: "#fff",
            border: "1px solid rgba(10,10,10,.08)",
            borderRadius: 12,
            padding: "40px",
            textAlign: "center",
            font: "400 14px/1 var(--font-sans, sans-serif)",
            color: "rgba(10,10,10,.35)",
          }}>
            콘텐츠가 없어요. 추가해보세요.
          </div>
        )}
      </div>

      {modalOpen && (
        <div style={overlayStyle} onClick={(e) => { if (e.target === e.currentTarget) closeModal(); }}>
          <div style={panelStyle}>
            <h2 style={{ font: "700 20px/1.2 var(--font-sans, sans-serif)", color: "#0a0a0a", margin: "0 0 24px" }}>
              {editingIdx !== null ? "인사이트 수정" : "인사이트 추가"}
            </h2>

            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

              {/* 썸네일 미리보기 (항상 표시) */}
              <div>
                <label style={labelStyle}>썸네일 미리보기</label>
                <div style={{ width: "100%", height: 140, borderRadius: 10, overflow: "hidden", background: form.thumb }}>
                  {form.thumbImg?.startsWith("data:") && (
                    <img src={form.thumbImg} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                  )}
                  {!form.thumbImg?.startsWith("data:") && CATEGORY_CONFIG[form.category ?? ""]?.img && (
                    <img src={CATEGORY_CONFIG[form.category ?? ""].img} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                  )}
                </div>
              </div>

              {/* other 카테고리일 때만 업로드 */}
              {form.category === "other" && (
                <div>
                  <label style={labelStyle}>썸네일 이미지 업로드</label>
                  <div style={{
                    width: "100%", height: 48, borderRadius: 8,
                    border: "1px dashed rgba(10,10,10,.2)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    cursor: "pointer", background: "transparent",
                  }}
                    onClick={() => document.getElementById("thumb-file-input")?.click()}
                  >
                    <span style={{ font: "400 13px/1 var(--font-sans, sans-serif)", color: "rgba(10,10,10,.45)" }}>
                      {form.thumbImg?.startsWith("data:") ? "다른 이미지로 변경" : "클릭해서 이미지 업로드"}
                    </span>
                    <input
                      id="thumb-file-input"
                      type="file"
                      accept="image/*"
                      style={{ display: "none" }}
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;
                        const compressed = await compressImage(file);
                        setForm((prev) => ({ ...prev, thumbImg: compressed }));
                      }}
                    />
                  </div>
                  {form.thumbImg?.startsWith("data:") && (
                    <button
                      onClick={() => setForm({ ...form, thumbImg: "" })}
                      style={{ ...btnBase, marginTop: 8, background: "transparent", color: "#e53e3e", border: "1px solid #e53e3e", font: "500 12px/1 var(--font-sans, sans-serif)", padding: "6px 12px" }}
                    >
                      이미지 제거
                    </button>
                  )}
                </div>
              )}

              <div>
                <label style={labelStyle}>Title</label>
                <input
                  style={inputStyle}
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="아티클 제목"
                />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div>
                  <label style={labelStyle}>썸네일 카테고리</label>
                  <select
                    style={inputStyle}
                    value={form.category ?? "log"}
                    onChange={(e) => {
                      const cat = e.target.value;
                      const cfg = CATEGORY_CONFIG[cat];
                      setForm((prev) => ({
                        ...prev,
                        category: cat,
                        thumb: cfg?.thumb ?? prev.thumb,
                        thumbImg: cfg?.img ?? "",
                      }));
                    }}
                  >
                    <option value="log">log</option>
                    <option value="talk">talk</option>
                    <option value="tech">tech</option>
                    <option value="other">other</option>
                  </select>
                </div>
                <div>
                  <label style={labelStyle}>태그</label>
                  <select
                    style={inputStyle}
                    value={form.tag}
                    onChange={(e) => setForm({ ...form, tag: e.target.value })}
                  >
                    <option value="기술 블로그">기술 블로그</option>
                    <option value="링크드인">링크드인</option>
                    <option value="유튜브">유튜브</option>
                    <option value="아티클">아티클</option>
                  </select>
                </div>
              </div>

              <div>
                <div>
                  <label style={labelStyle}>Date</label>
                  <input
                    style={inputStyle}
                    value={form.date}
                    onChange={(e) => setForm({ ...form, date: e.target.value })}
                    placeholder="2026-04-22"
                  />
                </div>
              </div>

              <div>
                <label style={labelStyle}>Excerpt</label>
                <textarea
                  style={{ ...inputStyle, height: 80, resize: "vertical" }}
                  value={form.excerpt}
                  onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
                  placeholder="아티클 요약..."
                />
              </div>

              <div>
                <label style={labelStyle}>외부 링크 URL</label>
                <input
                  style={inputStyle}
                  value={form.url ?? ""}
                  onChange={(e) => setForm({ ...form, url: e.target.value })}
                  onBlur={(e) => {
                    const v = e.target.value.trim();
                    if (!v) return;
                    if (!v.startsWith("http://") && !v.startsWith("https://")) {
                      setForm((prev) => ({ ...prev, url: `https://${v}` }));
                    }
                  }}
                  placeholder="example.com"
                  type="text"
                />
              </div>
            </div>

            <div style={{ display: "flex", gap: 10, marginTop: 28, justifyContent: "flex-end" }}>
              <button
                onClick={closeModal}
                style={{ ...btnBase, background: "transparent", color: "rgba(10,10,10,.6)", border: "1px solid rgba(10,10,10,.14)" }}
              >
                취소
              </button>
              <button
                onClick={handleSave}
                style={{ ...btnBase, background: "#0a0a0a", color: "#fff", padding: "10px 20px" }}
              >
                저장
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
