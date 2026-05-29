"use client";

import { useState, useEffect, useRef } from "react";
import type { InsightItem } from "../../lib/store";
import { overlayStyle, panelStyle, inputStyle, labelStyle, btnBase } from "../adminStyles";

const CATEGORY_CONFIG: Record<string, { thumb: string; img?: string }> = {
  log:   { thumb: "linear-gradient(135deg,#34D399,#059669)", img: "/assets/log.png" },
  talk:  { thumb: "linear-gradient(135deg,#8B5CF6,#3B82F6)", img: "/assets/talk.png" },
  tech:  { thumb: "linear-gradient(135deg,#38BDF8,#6366F1)", img: "/assets/tech.png" },
  other: { thumb: "linear-gradient(135deg,#1a1d24,#0a0a0a)" },
};

const EMPTY_ITEM: Omit<InsightItem, "id"> = {
  mark: "", markColor: "#0a0a0a",
  thumb: CATEGORY_CONFIG.log.thumb, thumbImg: CATEGORY_CONFIG.log.img,
  title: "", tag: "기술 블로그", category: "log",
  date: "", excerpt: "", url: "", featured: false,
};

async function uploadImage(file: File): Promise<string> {
  const fd = new FormData();
  fd.append("file", file);
  fd.append("bucket", "insight-images");
  const res = await fetch("/api/admin/storage", { method: "POST", body: fd });
  if (!res.ok) throw new Error("이미지 업로드 실패");
  const { url } = await res.json();
  return url as string;
}

async function deleteStorageImage(url: string) {
  if (!url?.startsWith("http")) return;
  await fetch("/api/admin/storage", {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ url, bucket: "insight-images" }),
  });
}

export default function AdminInsightPage() {
  const [items, setItems] = useState<InsightItem[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const mouseDownOnOverlay = useRef(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<Omit<InsightItem, "id">>(EMPTY_ITEM);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetch("/api/admin/insight").then((r) => r.json()).then(setItems).catch(console.error);
  }, []);

  function openAdd() { setEditingId(null); setForm(EMPTY_ITEM); setModalOpen(true); }
  function openEdit(item: InsightItem) { setEditingId(item.id!); const { id, ...rest } = item; setForm(rest); setModalOpen(true); }
  function closeModal() { setModalOpen(false); setEditingId(null); }

  async function handleSave() {
    setSaving(true);
    try {
      const payload = {
        mark:       form.mark,
        mark_color: form.markColor,
        thumb:      form.thumb,
        thumb_img:  form.thumbImg ?? "",
        title:      form.title,
        tag:        form.tag,
        category:   form.category ?? "log",
        date:       form.date,
        excerpt:    form.excerpt,
        url:        form.url ?? "",
        featured:   form.featured ?? false,
      };

      if (editingId !== null) {
        await fetch(`/api/admin/insight/${editingId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      } else {
        await fetch("/api/admin/insight", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      }

      const fresh = await fetch("/api/admin/insight").then((r) => r.json());
      setItems(fresh);
      closeModal();
    } catch (err) {
      alert("저장에 실패했어요.");
      console.error(err);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(item: InsightItem) {
    if (!confirm("정말 삭제하시겠어요?")) return;
    if (item.thumbImg?.startsWith("http")) await deleteStorageImage(item.thumbImg);
    await fetch(`/api/admin/insight/${item.id}`, { method: "DELETE" });
    setItems((prev) => prev.filter((it) => it.id !== item.id));
  }

  async function toggleFeatured(item: InsightItem) {
    await fetch(`/api/admin/insight/${item.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ featured: !item.featured }),
    });
    setItems((prev) => prev.map((it) => it.id === item.id ? { ...it, featured: !it.featured } : it));
  }

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 28 }}>
        <div>
          <h1 style={{ font: "700 24px/1.2 var(--font-sans, sans-serif)", letterSpacing: "-.02em", color: "#0a0a0a", margin: "0 0 4px" }}>인사이트</h1>
          <p style={{ font: "400 13px/1 var(--font-sans, sans-serif)", color: "rgba(10,10,10,.45)", margin: 0 }}>{items.length}개의 아티클</p>
        </div>
        <button onClick={openAdd} style={{ ...btnBase, background: "#0a0a0a", color: "#fff", padding: "10px 18px" }}>+ 추가</button>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {items.map((item) => (
          <div key={item.id} style={{ background: "#fff", border: "1px solid rgba(10,10,10,.08)", borderRadius: 12, padding: "16px 20px", display: "flex", alignItems: "center", gap: 16 }}>
            <div style={{ width: 52, height: 52, borderRadius: 10, background: item.thumb, flexShrink: 0, overflow: "hidden" }}>
              {item.thumbImg && <img src={item.thumbImg} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ font: "600 14px/1.3 var(--font-sans, sans-serif)", color: "#0a0a0a", marginBottom: 4, whiteSpace: "pre-line" }}>{item.title}</div>
              <div style={{ font: "400 12px/1 var(--font-sans, sans-serif)", color: "rgba(10,10,10,.45)", display: "flex", gap: 8, alignItems: "center" }}>
                <span>{item.tag} · {item.date}</span>
                {item.url && <span style={{ font: "500 11px/1 var(--font-sans, sans-serif)", padding: "2px 6px", borderRadius: 4, background: "rgba(0,183,255,.1)", color: "#0077aa" }}>링크 연결됨</span>}
              </div>
            </div>
            <div style={{ display: "flex", gap: 8, flexShrink: 0, alignItems: "center" }}>
              <button onClick={() => toggleFeatured(item)} style={{ ...btnBase, background: item.featured ? "#0a0a0a" : "transparent", color: item.featured ? "#fff" : "rgba(10,10,10,.4)", border: item.featured ? "1px solid #0a0a0a" : "1px solid rgba(10,10,10,.15)", padding: "5px 10px", font: "500 11px/1 var(--font-sans, sans-serif)" }}>
                {item.featured ? "메인 노출" : "미노출"}
              </button>
              <button onClick={() => openEdit(item)} style={{ ...btnBase, background: "transparent", color: "#0a0a0a", border: "1px solid rgba(10,10,10,.2)" }}>수정</button>
              <button onClick={() => handleDelete(item)} style={{ ...btnBase, background: "transparent", color: "#e53e3e", border: "1px solid #e53e3e" }}>삭제</button>
            </div>
          </div>
        ))}
        {items.length === 0 && (
          <div style={{ background: "#fff", border: "1px solid rgba(10,10,10,.08)", borderRadius: 12, padding: "40px", textAlign: "center", font: "400 14px/1 var(--font-sans, sans-serif)", color: "rgba(10,10,10,.35)" }}>
            콘텐츠가 없어요. 추가해보세요.
          </div>
        )}
      </div>

      {modalOpen && (
        <div style={overlayStyle} onMouseDown={(e) => { mouseDownOnOverlay.current = e.target === e.currentTarget; }} onClick={(e) => { if (mouseDownOnOverlay.current && e.target === e.currentTarget) closeModal(); }}>
          <div style={panelStyle(600)}>
            <h2 style={{ font: "700 20px/1.2 var(--font-sans, sans-serif)", color: "#0a0a0a", margin: "0 0 24px" }}>
              {editingId !== null ? "인사이트 수정" : "인사이트 추가"}
            </h2>

            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {/* 썸네일 미리보기 */}
              <div>
                <label style={labelStyle}>썸네일 미리보기</label>
                <div style={{ width: "100%", height: 140, borderRadius: 10, overflow: "hidden", background: form.thumb }}>
                  {form.thumbImg && (
                    <img src={form.thumbImg} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                  )}
                </div>
              </div>

              {/* other 카테고리 이미지 업로드 */}
              {form.category === "other" && (
                <div>
                  <label style={labelStyle}>썸네일 이미지 업로드</label>
                  <div
                    style={{ width: "100%", height: 48, borderRadius: 8, border: "1px dashed rgba(10,10,10,.2)", display: "flex", alignItems: "center", justifyContent: "center", cursor: uploading ? "default" : "pointer" }}
                    onClick={() => !uploading && document.getElementById("thumb-file-input")?.click()}
                  >
                    <span style={{ font: "400 13px/1 var(--font-sans, sans-serif)", color: "rgba(10,10,10,.45)" }}>
                      {uploading ? "업로드 중..." : form.thumbImg?.startsWith("http") ? "다른 이미지로 변경" : "클릭해서 이미지 업로드"}
                    </span>
                    <input
                      id="thumb-file-input"
                      type="file"
                      accept="image/*"
                      style={{ display: "none" }}
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;
                        setUploading(true);
                        try {
                          if (form.thumbImg?.startsWith("http")) await deleteStorageImage(form.thumbImg);
                          const url = await uploadImage(file);
                          setForm((f) => ({ ...f, thumbImg: url }));
                        } catch { alert("업로드 실패"); }
                        finally { setUploading(false); }
                      }}
                    />
                  </div>
                  {form.thumbImg?.startsWith("http") && (
                    <button onClick={() => { deleteStorageImage(form.thumbImg!); setForm((f) => ({ ...f, thumbImg: "" })); }} style={{ ...btnBase, marginTop: 8, background: "transparent", color: "#e53e3e", border: "1px solid #e53e3e", font: "500 12px/1 var(--font-sans, sans-serif)", padding: "6px 12px" }}>이미지 제거</button>
                  )}
                </div>
              )}

              <div>
                <label style={labelStyle}>Title</label>
                <input style={inputStyle} value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} placeholder="아티클 제목" />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div>
                  <label style={labelStyle}>썸네일 카테고리</label>
                  <select style={inputStyle} value={form.category ?? "log"} onChange={(e) => {
                    const cat = e.target.value;
                    const cfg = CATEGORY_CONFIG[cat];
                    setForm((f) => ({ ...f, category: cat, thumb: cfg?.thumb ?? f.thumb, thumbImg: cfg?.img ?? "" }));
                  }}>
                    <option value="log">log</option>
                    <option value="talk">talk</option>
                    <option value="tech">tech</option>
                    <option value="other">other</option>
                  </select>
                </div>
                <div>
                  <label style={labelStyle}>태그</label>
                  <select style={inputStyle} value={form.tag} onChange={(e) => setForm((f) => ({ ...f, tag: e.target.value }))}>
                    <option value="기술 블로그">기술 블로그</option>
                    <option value="링크드인">링크드인</option>
                    <option value="유튜브">유튜브</option>
                    <option value="아티클">아티클</option>
                  </select>
                </div>
              </div>

              <div>
                <label style={labelStyle}>Date</label>
                <input style={inputStyle} value={form.date} onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))} placeholder="2026-04-22" />
              </div>

              <div>
                <label style={labelStyle}>Excerpt</label>
                <textarea style={{ ...inputStyle, height: 80, resize: "vertical" }} value={form.excerpt} onChange={(e) => setForm((f) => ({ ...f, excerpt: e.target.value }))} placeholder="아티클 요약..." />
              </div>

              <div>
                <label style={labelStyle}>외부 링크 URL</label>
                <input
                  style={inputStyle}
                  value={form.url ?? ""}
                  onChange={(e) => setForm((f) => ({ ...f, url: e.target.value }))}
                  onBlur={(e) => {
                    const v = e.target.value.trim();
                    if (v && !v.startsWith("http://") && !v.startsWith("https://"))
                      setForm((f) => ({ ...f, url: `https://${v}` }));
                  }}
                  placeholder="example.com"
                />
              </div>
            </div>

            <div style={{ display: "flex", gap: 10, marginTop: 28, justifyContent: "flex-end" }}>
              <button onClick={closeModal} style={{ ...btnBase, background: "transparent", color: "rgba(10,10,10,.6)", border: "1px solid rgba(10,10,10,.14)" }}>취소</button>
              <button onClick={handleSave} disabled={saving} style={{ ...btnBase, background: saving ? "rgba(10,10,10,.4)" : "#0a0a0a", color: "#fff", padding: "10px 20px" }}>
                {saving ? "저장 중..." : "저장"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
