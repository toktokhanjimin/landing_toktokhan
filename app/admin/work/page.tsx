"use client";

import { useState, useEffect, useRef, type CSSProperties } from "react";
import type { WorkItem, InsightItem } from "../../lib/store";
import { dbToWorkItem, dbToInsightItem } from "../../lib/db-mappers";
import { toSlug } from "../../lib/slug";
import { overlayStyle, panelStyle, inputStyle, textareaStyle, labelStyle, btnBase } from "../adminStyles";
import AdminSelect from "../AdminSelect";

const WORK_TYPES = [
  { value: "WEB", label: "WEB" },
  { value: "APP", label: "APP" },
];

const WORK_CATEGORIES = [
  { value: "AI/AX",                label: "AI/AX"                },
  { value: "Commerce & Community", label: "Commerce & Community" },
  { value: "Entertainment & O2O",  label: "Entertainment & O2O"  },
  { value: "NFT & Blockchain",     label: "NFT & Blockchain"     },
  { value: "Finance",              label: "Finance"              },
  { value: "SaaS&Admin",           label: "SaaS&Admin"           },
  { value: "Brand Consulting",     label: "Brand Consulting"     },
  { value: "ETC",                  label: "ETC"                  },
];

const MONTHS = [
  { value: "Jan", label: "Jan" }, { value: "Feb", label: "Feb" },
  { value: "Mar", label: "Mar" }, { value: "Apr", label: "Apr" },
  { value: "May", label: "May" }, { value: "Jun", label: "Jun" },
  { value: "Jul", label: "Jul" }, { value: "Aug", label: "Aug" },
  { value: "Sep", label: "Sep" }, { value: "Oct", label: "Oct" },
  { value: "Nov", label: "Nov" }, { value: "Dec", label: "Dec" },
];
const YEARS = Array.from({ length: 12 }, (_, i) => {
  const y = String(2024 + i - 6);
  return { value: y, label: y };
});

function parseDateParts(date: string): { month: string; year: string } {
  const m = date.match(/^([A-Za-z]+),?\s*(\d{4})$/);
  return m ? { month: m[1], year: m[2] } : { month: "", year: "" };
}

const EMPTY_SECTION = { h: "", p: "", grad: "", img: "" };

const EMPTY_ITEM: Omit<WorkItem, "id"> = {
  client: "", tag: "WEB", category: "Commerce & Community", year: "", date: "",
  bg: "", desc: "", title: "", lead: "", thumbImg: "", slug: "",
  sections: [{ ...EMPTY_SECTION }],
  points: [], featured: false, comingSoon: false, relatedInsights: [],
};

function genId() {
  return Math.random().toString(36).slice(2, 10);
}

// ── 이미지 업로드 헬퍼 ─────────────────────────────────────────────────────────

async function uploadImage(file: File, bucket: string): Promise<string> {
  const fd = new FormData();
  fd.append("file", file);
  fd.append("bucket", bucket);
  const res = await fetch("/api/admin/storage", { method: "POST", body: fd });
  if (!res.ok) throw new Error("이미지 업로드 실패");
  const { url } = await res.json();
  return url as string;
}

async function deleteImage(url: string, bucket: string) {
  if (!url?.startsWith("http")) return;
  await fetch("/api/admin/storage", {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ url, bucket }),
  });
}

// ── ImageUpload 컴포넌트 ──────────────────────────────────────────────────────

function ImageUpload({
  value, onChange, inputId, height = 100, label, bucket,
}: {
  value: string; onChange: (v: string) => void;
  inputId: string; height?: number; label?: string; bucket: string;
}) {
  const [uploading, setUploading] = useState(false);

  return (
    <div>
      {label && <label style={labelStyle}>{label}</label>}
      {value ? (
        <div style={{ position: "relative", width: "100%", height, borderRadius: 8, overflow: "hidden", marginBottom: 6 }}>
          <img src={value} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
          <button
            onClick={() => { deleteImage(value, bucket); onChange(""); }}
            style={{
              position: "absolute", top: 6, right: 6,
              background: "rgba(0,0,0,.6)", color: "#fff",
              border: "none", borderRadius: 5, padding: "4px 8px",
              font: "500 11px/1 var(--font-sans, sans-serif)", cursor: "pointer",
            }}
          >
            제거
          </button>
        </div>
      ) : (
        <div
          style={{
            width: "100%", height: 48, borderRadius: 8,
            border: "1px dashed rgba(10,10,10,.2)",
            display: "flex", alignItems: "center", justifyContent: "center",
            cursor: uploading ? "default" : "pointer", background: "transparent",
          }}
          onClick={() => !uploading && document.getElementById(inputId)?.click()}
        >
          <span style={{ font: "400 13px/1 var(--font-sans, sans-serif)", color: "rgba(10,10,10,.45)" }}>
            {uploading ? "업로드 중..." : "클릭해서 이미지 업로드"}
          </span>
        </div>
      )}
      <input
        id={inputId}
        type="file"
        accept="image/*"
        style={{ display: "none" }}
        onChange={async (e) => {
          const file = e.target.files?.[0];
          if (!file) return;
          setUploading(true);
          try {
            const url = await uploadImage(file, bucket);
            onChange(url);
          } catch (err) {
            alert("이미지 업로드에 실패했어요.");
            console.error(err);
          } finally {
            setUploading(false);
            e.target.value = "";
          }
        }}
      />
    </div>
  );
}

// ── FieldWithCount ────────────────────────────────────────────────────────────

function FieldWithCount({ label, value, maxLength, children }: { label: string; value: string; maxLength: number; children: React.ReactNode }) {
  const count = value.length;
  const over = count > maxLength * 0.9;
  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
        <label style={{ ...labelStyle, marginBottom: 0 }}>{label}</label>
        <span style={{ font: "400 11px/1 var(--font-sans, sans-serif)", color: over ? "#e53e3e" : "rgba(10,10,10,.35)" }}>
          {count} / {maxLength}
        </span>
      </div>
      {children}
    </div>
  );
}

// ── 메인 컴포넌트 ─────────────────────────────────────────────────────────────

export default function AdminWorkPage() {
  const [items, setItems] = useState<WorkItem[]>([]);
  const [allInsights, setAllInsights] = useState<InsightItem[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<WorkItem | null>(null);
  const [form, setForm] = useState<Omit<WorkItem, "id">>(EMPTY_ITEM);
  const [saving, setSaving] = useState(false);
  const [pointsText, setPointsText] = useState("");
  const mouseDownOnOverlay = useRef(false);
  const slugManuallyEdited = useRef(false);

  useEffect(() => {
    fetch("/api/admin/work").then((r) => r.json()).then((d) => setItems(d.map(dbToWorkItem))).catch(console.error);
    fetch("/api/admin/insight").then((r) => r.json()).then((d) => setAllInsights(d.map(dbToInsightItem))).catch(console.error);
  }, []);

  function openAdd() { slugManuallyEdited.current = false; setEditing(null); setForm(EMPTY_ITEM); setPointsText(""); setModalOpen(true); }
  function openEdit(item: WorkItem) { slugManuallyEdited.current = false; setEditing(item); const { id, ...rest } = item; setForm({ ...rest, slug: toSlug(rest.title) }); setPointsText(rest.points.join("\n")); setModalOpen(true); }

  function isDirty() {
    if (form.client || form.title || form.lead || form.desc) return true;
    if (form.sections.some((s) => s.h || s.p)) return true;
    if (form.points.some((p) => p)) return true;
    return false;
  }

  function forceCloseModal() { setModalOpen(false); setEditing(null); }
  function closeModal() {
    if (isDirty() && !confirm("작성 중인 내용이 있어요. 정말 닫으시겠어요?")) return;
    forceCloseModal();
  }

  async function handleSave() {
    setSaving(true);
    try {
      const payload = {
        id:                  editing?.id ?? genId(),
        client:              form.client,
        tag:                 form.tag,
        category:            form.category,
        year:                form.year,
        date:                form.date,
        bg:                  form.bg,
        description:         form.lead,
        title:               form.title,
        lead:                form.lead,
        slug:                form.slug || toSlug(form.title),
        thumb_img:           form.thumbImg ?? "",
        sections:            form.sections,
        points:              pointsText.split("\n").map((l) => l.slice(0, 40)).filter((p) => p.trim()),
        featured:            form.featured ?? false,
        coming_soon:         form.comingSoon ?? false,
        related_insight_ids: form.relatedInsights ?? [],
      };

      if (editing) {
        await fetch(`/api/admin/work/${editing.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      } else {
        await fetch("/api/admin/work", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      }

      // 목록 갱신
      const fresh = await fetch("/api/admin/work").then((r) => r.json());
      setItems(fresh.map(dbToWorkItem));
      forceCloseModal();
    } catch (err) {
      alert("저장에 실패했어요.");
      console.error(err);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("정말 삭제하시겠어요?")) return;
    await fetch(`/api/admin/work/${id}`, { method: "DELETE" });
    setItems((prev) => prev.filter((it) => it.id !== id));
  }

  async function handleReorder(idx: number, dir: -1 | 1) {
    const next = idx + dir;
    if (next < 0 || next >= items.length) return;
    const updated = [...items];
    [updated[idx], updated[next]] = [updated[next], updated[idx]];
    // sort_order를 인덱스 기준으로 재할당
    const reordered = updated.map((it, i) => ({ ...it, sort_order: i }));
    setItems(reordered);
    // Supabase 업데이트 (두 항목)
    await Promise.all([
      fetch(`/api/admin/work/${reordered[idx].id}`, {
        method: "PUT", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sort_order: reordered[idx].sort_order }),
      }),
      fetch(`/api/admin/work/${reordered[next].id}`, {
        method: "PUT", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sort_order: reordered[next].sort_order }),
      }),
    ]);
  }

  async function toggleFeatured(item: WorkItem) {
    await fetch(`/api/admin/work/${item.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ featured: !item.featured }),
    });
    setItems((prev) => prev.map((it) => it.id === item.id ? { ...it, featured: !it.featured } : it));
  }

  function setSection(idx: number, field: keyof typeof EMPTY_SECTION, val: string) {
    setForm((f) => ({ ...f, sections: f.sections.map((s, i) => i === idx ? { ...s, [field]: val } : s) }));
  }
  function addSection() { setForm((f) => ({ ...f, sections: [...f.sections, { ...EMPTY_SECTION }] })); }
  function removeSection(idx: number) {
    if (form.sections.length <= 1) return;
    setForm((f) => ({ ...f, sections: f.sections.filter((_, i) => i !== idx) }));
  }

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 28 }}>
        <div>
          <h1 style={{ font: "700 24px/1.2 var(--font-sans, sans-serif)", letterSpacing: "-.02em", color: "#0a0a0a", margin: "0 0 4px" }}>
            포트폴리오
          </h1>
          <p style={{ font: "400 13px/1 var(--font-sans, sans-serif)", color: "rgba(10,10,10,.45)", margin: 0 }}>
            {items.length}개의 케이스
          </p>
        </div>
        <button onClick={openAdd} style={{ ...btnBase, background: "#0a0a0a", color: "#fff", padding: "10px 18px" }}>
          + 추가
        </button>
      </div>

      <div style={{ background: "#fff", border: "1px solid rgba(10,10,10,.08)", borderRadius: 12, overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ borderBottom: "1px solid rgba(10,10,10,.08)" }}>
              {["순서", "썸네일", "Client", "Tag", "Category", "Year", "메인 노출", ""].map((h) => (
                <th key={h} style={{ padding: "14px 16px", font: "500 12px/1 var(--font-sans, sans-serif)", color: "rgba(10,10,10,.45)", letterSpacing: ".04em", textAlign: "left" }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {items.map((item, idx) => (
              <tr key={item.id} style={{ borderBottom: "1px solid rgba(10,10,10,.05)" }}>
                <td style={{ padding: "8px 12px" }}>
                  <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                    <button
                      onClick={() => handleReorder(idx, -1)}
                      disabled={idx === 0}
                      style={{ ...btnBase, padding: "3px 8px", font: "500 12px/1 var(--font-sans, sans-serif)", background: "transparent", border: "1px solid rgba(10,10,10,.15)", color: idx === 0 ? "rgba(10,10,10,.2)" : "#0a0a0a", cursor: idx === 0 ? "default" : "pointer" }}
                    >↑</button>
                    <button
                      onClick={() => handleReorder(idx, 1)}
                      disabled={idx === items.length - 1}
                      style={{ ...btnBase, padding: "3px 8px", font: "500 12px/1 var(--font-sans, sans-serif)", background: "transparent", border: "1px solid rgba(10,10,10,.15)", color: idx === items.length - 1 ? "rgba(10,10,10,.2)" : "#0a0a0a", cursor: idx === items.length - 1 ? "default" : "pointer" }}
                    >↓</button>
                  </div>
                </td>
                <td style={{ padding: "12px 16px" }}>
                  <div style={{ width: 44, height: 44, borderRadius: 8, overflow: "hidden", background: item.bg || "#eee" }}>
                    {item.thumbImg && <img src={item.thumbImg} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />}
                  </div>
                </td>
                <td style={{ padding: "14px 16px", font: "600 14px/1 var(--font-sans, sans-serif)", color: "#0a0a0a" }}>{item.client}</td>
                <td style={{ padding: "14px 16px", font: "400 13px/1 var(--font-sans, sans-serif)", color: "rgba(10,10,10,.7)" }}>{item.tag}</td>
                <td style={{ padding: "14px 16px" }}>
                  <span style={{ font: "500 11px/1 var(--font-sans, sans-serif)", padding: "4px 8px", borderRadius: 5, background: "rgba(10,10,10,.06)", color: "#0a0a0a" }}>
                    {item.category}
                  </span>
                </td>
                <td style={{ padding: "14px 16px", font: "400 13px/1 var(--font-sans, sans-serif)", color: "rgba(10,10,10,.6)" }}>{item.year}</td>
                <td style={{ padding: "14px 16px" }}>
                  <button
                    onClick={() => toggleFeatured(item)}
                    style={{
                      ...btnBase,
                      background: item.featured ? "#0a0a0a" : "transparent",
                      color: item.featured ? "#fff" : "rgba(10,10,10,.4)",
                      border: item.featured ? "1px solid #0a0a0a" : "1px solid rgba(10,10,10,.15)",
                      padding: "5px 10px", font: "500 11px/1 var(--font-sans, sans-serif)",
                    }}
                  >
                    {item.featured ? "노출 중" : "미노출"}
                  </button>
                </td>
                <td style={{ padding: "14px 16px" }}>
                  <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
                    <button onClick={() => openEdit(item)} style={{ ...btnBase, background: "transparent", color: "#0a0a0a", border: "1px solid rgba(10,10,10,.2)" }}>수정</button>
                    <button onClick={() => handleDelete(item.id)} style={{ ...btnBase, background: "transparent", color: "#e53e3e", border: "1px solid #e53e3e" }}>삭제</button>
                  </div>
                </td>
              </tr>
            ))}
            {items.length === 0 && (
              <tr>
                <td colSpan={7} style={{ padding: "40px 16px", textAlign: "center", font: "400 14px/1 var(--font-sans, sans-serif)", color: "rgba(10,10,10,.35)" }}>
                  콘텐츠가 없어요. 추가해보세요.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {modalOpen && (
        <div
          style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.3)", zIndex: 200 }}
          onMouseDown={(e) => { mouseDownOnOverlay.current = e.target === e.currentTarget; }}
          onClick={(e) => { if (mouseDownOnOverlay.current && e.target === e.currentTarget) closeModal(); }}
        >
          <style>{`@keyframes drawerIn{from{transform:translateX(100%)}to{transform:translateX(0)}}`}</style>
          <div style={{
            position: "fixed", top: 0, right: 0, bottom: 0,
            width: "clamp(360px, 33vw, 560px)",
            background: "#fff",
            boxShadow: "-4px 0 24px rgba(0,0,0,.12)",
            overflowY: "auto",
            padding: "32px 28px",
            animation: "drawerIn .25s cubic-bezier(.32,.72,0,1)",
            zIndex: 201,
          }}>
            <h2 style={{ font: "700 20px/1.2 var(--font-sans, sans-serif)", color: "#0a0a0a", margin: "0 0 24px" }}>
              {editing ? "케이스 수정" : "케이스 추가"}
            </h2>

            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <ImageUpload label="썸네일 이미지" value={form.thumbImg ?? ""} onChange={(v) => setForm((f) => ({ ...f, thumbImg: v }))} inputId="work-thumb-input" height={120} bucket="work-images" />

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <FieldWithCount label="Client" value={form.client} maxLength={20}>
                  <input style={inputStyle} value={form.client} maxLength={20} onChange={(e) => setForm((f) => ({ ...f, client: e.target.value }))} placeholder="BLUEGARAGE" />
                </FieldWithCount>
                <div>
                  <label style={labelStyle}>Type</label>
                  <AdminSelect
                    value={form.tag}
                    onValueChange={(v) => setForm((f) => ({ ...f, tag: v }))}
                    options={WORK_TYPES}
                    placeholder="WEB / APP"
                  />
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
                <div>
                  <label style={labelStyle}>Category</label>
                  <AdminSelect
                    value={form.category}
                    onValueChange={(v) => setForm((f) => ({ ...f, category: v }))}
                    options={WORK_CATEGORIES}
                  />
                </div>
                <div>
                  <label style={labelStyle}>Month</label>
                  <AdminSelect
                    value={parseDateParts(form.date).month}
                    onValueChange={(m) => {
                      const { year } = parseDateParts(form.date);
                      const y = year || String(new Date().getFullYear());
                      setForm((f) => ({ ...f, date: `${m}, ${y}` }));
                    }}
                    options={MONTHS}
                    placeholder="Month"
                  />
                </div>
                <div>
                  <label style={labelStyle}>Year</label>
                  <AdminSelect
                    value={parseDateParts(form.date).year}
                    onValueChange={(y) => {
                      const { month } = parseDateParts(form.date);
                      const m = month || "Jan";
                      setForm((f) => ({ ...f, date: `${m}, ${y}`, year: y }));
                    }}
                    options={YEARS}
                    placeholder="Year"
                  />
                </div>
              </div>

              <FieldWithCount label="Title" value={form.title} maxLength={50}>
                <input
                  style={inputStyle}
                  value={form.title}
                  maxLength={50}
                  onChange={(e) => {
                    const title = e.target.value;
                    setForm((f) => ({
                      ...f,
                      title,
                      slug: slugManuallyEdited.current ? f.slug : toSlug(title),
                    }));
                  }}
                  placeholder="프로젝트 제목"
                />
              </FieldWithCount>

              <div>
                <label style={labelStyle}>URL 슬러그</label>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ font: "400 12px/1 var(--font-sans, sans-serif)", color: "rgba(10,10,10,.4)", flexShrink: 0 }}>/work/</span>
                  <input
                    style={{ ...inputStyle, font: "400 13px/1 var(--font-mono, monospace)", color: "rgba(10,10,10,.7)" }}
                    value={form.slug ?? ""}
                    onChange={(e) => { slugManuallyEdited.current = true; setForm((f) => ({ ...f, slug: e.target.value })); }}
                    placeholder="url-slug"
                  />
                </div>
              </div>

              <FieldWithCount label="Lead (소개 문구)" value={form.lead} maxLength={300}>
                <textarea style={{ ...textareaStyle, height: 100 }} value={form.lead} maxLength={300} onChange={(e) => setForm((f) => ({ ...f, lead: e.target.value }))} placeholder="프로젝트 소개..." />
              </FieldWithCount>

              {/* 섹션 */}
              <div>
                <div style={{ font: "600 13px/1 var(--font-sans, sans-serif)", color: "#0a0a0a", marginBottom: 12 }}>
                  섹션 ({form.sections.length}개)
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  {form.sections.map((sec, i) => (
                    <div key={i} style={{ padding: 16, background: "#f9f9f9", borderRadius: 8 }}>
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
                        <div style={{ font: "600 12px/1 var(--font-sans, sans-serif)", color: "rgba(10,10,10,.5)", letterSpacing: ".06em" }}>섹션 {i + 1}</div>
                        {form.sections.length > 1 && (
                          <button onClick={() => removeSection(i)} style={{ ...btnBase, background: "transparent", color: "#e53e3e", border: "1px solid #e53e3e", padding: "4px 8px", font: "500 11px/1 var(--font-sans, sans-serif)" }}>삭제</button>
                        )}
                      </div>
                      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                        <FieldWithCount label="제목 (h)" value={sec.h} maxLength={50}>
                          <input style={inputStyle} value={sec.h} maxLength={50} onChange={(e) => setSection(i, "h", e.target.value)} placeholder="문제 / 접근 / 결과" />
                        </FieldWithCount>
                        <FieldWithCount label="내용 (p)" value={sec.p} maxLength={300}>
                          <textarea style={{ ...textareaStyle, height: 96, resize: "vertical" }} value={sec.p} maxLength={300} onChange={(e) => setSection(i, "p", e.target.value)} />
                        </FieldWithCount>
                        <ImageUpload label="섹션 이미지" value={sec.img ?? ""} onChange={(v) => setSection(i, "img", v)} inputId={`work-sec-img-${i}`} height={80} bucket="work-images" />
                      </div>
                    </div>
                  ))}
                </div>
                <button onClick={addSection} style={{ ...btnBase, marginTop: 10, width: "100%", background: "transparent", color: "rgba(10,10,10,.6)", border: "1px dashed rgba(10,10,10,.2)", padding: "10px 14px", textAlign: "center" as const }}>
                  + 섹션 추가
                </button>
              </div>

              {/* 관련 인사이트 — ID 기반 */}
              <div>
                <label style={labelStyle}>관련 인사이트 (최대 3개)</label>
                <div style={{ display: "flex", flexDirection: "column", gap: 6, maxHeight: 200, overflowY: "auto", padding: "8px 10px", background: "#f9f9f9", borderRadius: 8, border: "1px solid rgba(10,10,10,.1)" }}>
                  {allInsights.length === 0 && (
                    <span style={{ font: "400 13px/1.5 var(--font-sans, sans-serif)", color: "rgba(10,10,10,.4)" }}>등록된 인사이트가 없어요.</span>
                  )}
                  {allInsights.map((ins) => {
                    const insId = ins.id!;
                    const selected = (form.relatedInsights ?? []).includes(insId);
                    const atMax = (form.relatedInsights ?? []).length >= 3;
                    return (
                      <label key={insId} style={{ display: "flex", alignItems: "flex-start", gap: 8, cursor: "pointer", padding: "6px 4px", borderRadius: 6, background: selected ? "rgba(10,133,248,.08)" : "transparent" }}>
                        <input
                          type="checkbox"
                          checked={selected}
                          disabled={!selected && atMax}
                          style={{ marginTop: 2, accentColor: "var(--btn-primary)", flexShrink: 0 }}
                          onChange={() => {
                            const prev = form.relatedInsights ?? [];
                            const next = selected ? prev.filter((x) => x !== insId) : [...prev, insId];
                            setForm((f) => ({ ...f, relatedInsights: next }));
                          }}
                        />
                        <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                          <span style={{ font: "500 13px/1.4 var(--font-sans, sans-serif)", color: selected ? "var(--btn-primary)" : "#0a0a0a" }}>{ins.title}</span>
                          <span style={{ font: "400 11px/1 var(--font-sans, sans-serif)", color: "rgba(10,10,10,.45)" }}>{ins.tag} · {ins.date}</span>
                        </div>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* 핵심 포인트 */}
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                  <label style={{ ...labelStyle, marginBottom: 0 }}>핵심 포인트 (한 줄에 하나씩)</label>
                  <span style={{ font: "400 11px/1 var(--font-sans, sans-serif)", color: "rgba(10,10,10,.35)" }}>줄당 최대 40자</span>
                </div>
                <textarea
                  style={{ ...textareaStyle, height: 80 }}
                  value={pointsText}
                  onChange={(e) => setPointsText(e.target.value)}
                  placeholder={"포인트 1\n포인트 2\n포인트 3"}
                />
              </div>
            </div>

            <div style={{ display: "flex", gap: 10, marginTop: 28, justifyContent: "space-between", alignItems: "center" }}>
              {/* 준비중 토글 */}
              <label style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer", userSelect: "none" }}>
                <div
                  onClick={() => setForm((f) => ({ ...f, comingSoon: !f.comingSoon }))}
                  style={{
                    width: 40, height: 22, borderRadius: 11,
                    background: form.comingSoon ? "#0a0a0a" : "rgba(10,10,10,.15)",
                    position: "relative", transition: "background .2s", cursor: "pointer", flexShrink: 0,
                  }}
                >
                  <div style={{
                    position: "absolute", top: 3, left: form.comingSoon ? 21 : 3,
                    width: 16, height: 16, borderRadius: "50%", background: "#fff",
                    transition: "left .2s", boxShadow: "0 1px 3px rgba(0,0,0,.2)",
                  }} />
                </div>
                <span style={{ font: "500 13px/1 var(--font-sans, sans-serif)", color: form.comingSoon ? "#0a0a0a" : "rgba(10,10,10,.45)" }}>
                  Coming Soon
                </span>
              </label>

              <div style={{ display: "flex", gap: 10 }}>
                <button onClick={closeModal} style={{ ...btnBase, background: "transparent", color: "rgba(10,10,10,.6)", border: "1px solid rgba(10,10,10,.14)" }}>취소</button>
                <button onClick={handleSave} disabled={saving} style={{ ...btnBase, background: saving ? "rgba(10,10,10,.4)" : "#0a0a0a", color: "#fff", padding: "10px 20px" }}>
                  {saving ? "저장 중..." : "저장"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
