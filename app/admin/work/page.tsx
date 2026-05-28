"use client";

import { useState, useEffect, useRef, type CSSProperties } from "react";
import { getWork, saveWork, getInsights, WorkItem, InsightItem } from "../../lib/store";
import { overlayStyle, panelStyle, inputStyle, labelStyle, btnBase, compressImage } from "../adminStyles";

const EMPTY_SECTION = { h: "", p: "", grad: "", img: "" };

const EMPTY_ITEM: Omit<WorkItem, "id"> = {
  client: "",
  tag: "",
  category: "AI",
  year: "",
  date: "",
  bg: "",
  desc: "",
  title: "",
  lead: "",
  thumbImg: "",
  sections: [
    { ...EMPTY_SECTION },
    { ...EMPTY_SECTION },
    { ...EMPTY_SECTION },
  ],
  points: [],
  featured: false,
  relatedInsights: [],
};

function genId() {
  return Math.random().toString(36).slice(2, 10);
}

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

function ImageUpload({
  value,
  onChange,
  inputId,
  height = 100,
  label,
}: {
  value: string;
  onChange: (v: string) => void;
  inputId: string;
  height?: number;
  label?: string;
}) {
  return (
    <div>
      {label && <label style={labelStyle}>{label}</label>}
      {value ? (
        <div style={{ position: "relative", width: "100%", height, borderRadius: 8, overflow: "hidden", marginBottom: 6 }}>
          <img src={value} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
          <button
            onClick={() => onChange("")}
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
            cursor: "pointer", background: "transparent",
          }}
          onClick={() => document.getElementById(inputId)?.click()}
        >
          <span style={{ font: "400 13px/1 var(--font-sans, sans-serif)", color: "rgba(10,10,10,.45)" }}>
            클릭해서 이미지 업로드
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
          const compressed = await compressImage(file);
          onChange(compressed);
          e.target.value = "";
        }}
      />
    </div>
  );
}

export default function AdminWorkPage() {
  const [items, setItems] = useState<WorkItem[]>([]);
  const [allInsights, setAllInsights] = useState<InsightItem[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<WorkItem | null>(null);
  const [form, setForm] = useState<Omit<WorkItem, "id">>(EMPTY_ITEM);
  const mouseDownOnOverlay = useRef(false);

  useEffect(() => {
    setItems(getWork());
    setAllInsights(getInsights());
  }, []);

  function openAdd() {
    setEditing(null);
    setForm(EMPTY_ITEM);
    setModalOpen(true);
  }

  function openEdit(item: WorkItem) {
    setEditing(item);
    const { id, ...rest } = item;
    setForm(rest);
    setModalOpen(true);
  }

  function closeModal() {
    setModalOpen(false);
    setEditing(null);
  }

  function handleSave() {
    let updated: WorkItem[];
    if (editing) {
      updated = items.map((it) =>
        it.id === editing.id ? { ...form, id: editing.id, desc: form.lead } : it
      );
    } else {
      const newItem: WorkItem = { ...form, id: genId(), desc: form.lead };
      updated = [newItem, ...items];
    }
    saveWork(updated);
    setItems(updated);
    closeModal();
  }

  function handleDelete(id: string) {
    if (!confirm("정말 삭제하시겠어요?")) return;
    const updated = items.filter((it) => it.id !== id);
    saveWork(updated);
    setItems(updated);
  }

  function toggleFeatured(id: string) {
    const updated = items.map((it) =>
      it.id === id ? { ...it, featured: !it.featured } : it
    );
    saveWork(updated);
    setItems(updated);
  }

  function setSection(idx: number, field: keyof typeof EMPTY_SECTION, val: string) {
    const sections = form.sections.map((s, i) => i === idx ? { ...s, [field]: val } : s);
    setForm({ ...form, sections });
  }

  function addSection() {
    setForm({ ...form, sections: [...form.sections, { ...EMPTY_SECTION }] });
  }

  function removeSection(idx: number) {
    if (form.sections.length <= 3) return;
    setForm({ ...form, sections: form.sections.filter((_, i) => i !== idx) });
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
        <button
          onClick={openAdd}
          style={{ ...btnBase, background: "#0a0a0a", color: "#fff", padding: "10px 18px" }}
        >
          + 추가
        </button>
      </div>

      <div style={{ background: "#fff", border: "1px solid rgba(10,10,10,.08)", borderRadius: 12, overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ borderBottom: "1px solid rgba(10,10,10,.08)" }}>
              {["썸네일", "Client", "Tag", "Category", "Year", "메인 노출", ""].map((h) => (
                <th key={h} style={{
                  padding: "14px 16px",
                  font: "500 12px/1 var(--font-sans, sans-serif)",
                  color: "rgba(10,10,10,.45)",
                  letterSpacing: ".04em",
                  textAlign: "left",
                }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id} style={{ borderBottom: "1px solid rgba(10,10,10,.05)" }}>
                <td style={{ padding: "12px 16px" }}>
                  <div style={{
                    width: 44, height: 44, borderRadius: 8, overflow: "hidden",
                    background: item.bg || "#eee", flexShrink: 0,
                  }}>
                    {item.thumbImg && (
                      <img src={item.thumbImg} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                    )}
                  </div>
                </td>
                <td style={{ padding: "14px 16px", font: "600 14px/1 var(--font-sans, sans-serif)", color: "#0a0a0a" }}>
                  {item.client}
                </td>
                <td style={{ padding: "14px 16px", font: "400 13px/1 var(--font-sans, sans-serif)", color: "rgba(10,10,10,.7)" }}>
                  {item.tag}
                </td>
                <td style={{ padding: "14px 16px" }}>
                  <span style={{
                    font: "500 11px/1 var(--font-sans, sans-serif)",
                    padding: "4px 8px", borderRadius: 5,
                    background: "rgba(10,10,10,.06)", color: "#0a0a0a",
                  }}>
                    {item.category}
                  </span>
                </td>
                <td style={{ padding: "14px 16px", font: "400 13px/1 var(--font-sans, sans-serif)", color: "rgba(10,10,10,.6)" }}>
                  {item.year}
                </td>
                <td style={{ padding: "14px 16px" }}>
                  <button
                    onClick={() => toggleFeatured(item.id)}
                    style={{
                      ...btnBase,
                      background: item.featured ? "#0a0a0a" : "transparent",
                      color: item.featured ? "#fff" : "rgba(10,10,10,.4)",
                      border: item.featured ? "1px solid #0a0a0a" : "1px solid rgba(10,10,10,.15)",
                      padding: "5px 10px",
                      font: "500 11px/1 var(--font-sans, sans-serif)",
                    }}
                  >
                    {item.featured ? "노출 중" : "미노출"}
                  </button>
                </td>
                <td style={{ padding: "14px 16px" }}>
                  <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
                    <button
                      onClick={() => openEdit(item)}
                      style={{ ...btnBase, background: "transparent", color: "#0a0a0a", border: "1px solid rgba(10,10,10,.2)" }}
                    >
                      수정
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      style={{ ...btnBase, background: "transparent", color: "#e53e3e", border: "1px solid #e53e3e" }}
                    >
                      삭제
                    </button>
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
        <div style={overlayStyle} onMouseDown={(e) => { mouseDownOnOverlay.current = e.target === e.currentTarget; }} onClick={(e) => { if (mouseDownOnOverlay.current && e.target === e.currentTarget) closeModal(); }}>
          <div style={panelStyle(640)}>
            <h2 style={{ font: "700 20px/1.2 var(--font-sans, sans-serif)", color: "#0a0a0a", margin: "0 0 24px" }}>
              {editing ? "케이스 수정" : "케이스 추가"}
            </h2>

            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

              {/* 썸네일 */}
              <ImageUpload
                label="썸네일 이미지"
                value={form.thumbImg ?? ""}
                onChange={(v) => setForm({ ...form, thumbImg: v })}
                inputId="work-thumb-input"
                height={120}
              />

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <FieldWithCount label="Client" value={form.client} maxLength={20}>
                  <input style={inputStyle} value={form.client} maxLength={20} onChange={(e) => setForm({ ...form, client: e.target.value })} placeholder="BLUEGARAGE" />
                </FieldWithCount>
                <FieldWithCount label="Tag" value={form.tag} maxLength={20}>
                  <input style={inputStyle} value={form.tag} maxLength={20} onChange={(e) => setForm({ ...form, tag: e.target.value })} placeholder="JYP360" />
                </FieldWithCount>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
                <div>
                  <label style={labelStyle}>Category</label>
                  <select style={inputStyle} value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
                    <option value="AX">AX</option>
                    <option value="AI">AI</option>
                    <option value="Ops">Ops</option>
                  </select>
                </div>
                <div>
                  <label style={labelStyle}>Year</label>
                  <input style={inputStyle} value={form.year} onChange={(e) => setForm({ ...form, year: e.target.value })} placeholder="2026" />
                </div>
                <div>
                  <label style={labelStyle}>Date</label>
                  <input style={inputStyle} value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} placeholder="2026.03.18" />
                </div>
              </div>

              <FieldWithCount label="Title" value={form.title} maxLength={40}>
                <input style={inputStyle} value={form.title} maxLength={40} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="프로젝트 제목" />
              </FieldWithCount>

              <FieldWithCount label="Lead (소개 문구)" value={form.lead} maxLength={120}>
                <textarea style={{ ...inputStyle, height: 80, resize: "vertical" }} value={form.lead} maxLength={120} onChange={(e) => setForm({ ...form, lead: e.target.value })} placeholder="프로젝트 소개..." />
              </FieldWithCount>

              {/* 섹션 */}
              <div>
                <div style={{ font: "600 13px/1 var(--font-sans, sans-serif)", color: "#0a0a0a", marginBottom: 12 }}>
                  섹션 ({form.sections.length}개)
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  {form.sections.map((sec, i) => (
                    <div key={i} style={{ padding: 16, background: "#f9f9f9", borderRadius: 8, position: "relative" }}>
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
                        <div style={{ font: "600 12px/1 var(--font-sans, sans-serif)", color: "rgba(10,10,10,.5)", letterSpacing: ".06em" }}>
                          섹션 {i + 1}
                        </div>
                        {form.sections.length > 3 && (
                          <button
                            onClick={() => removeSection(i)}
                            style={{ ...btnBase, background: "transparent", color: "#e53e3e", border: "1px solid #e53e3e", padding: "4px 8px", font: "500 11px/1 var(--font-sans, sans-serif)" }}
                          >
                            삭제
                          </button>
                        )}
                      </div>
                      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                        <FieldWithCount label="제목 (h)" value={sec.h} maxLength={30}>
                          <input style={inputStyle} value={sec.h} maxLength={30} onChange={(e) => setSection(i, "h", e.target.value)} placeholder="문제 / 접근 / 결과" />
                        </FieldWithCount>
                        <FieldWithCount label="내용 (p)" value={sec.p} maxLength={150}>
                          <textarea style={{ ...inputStyle, height: 72, resize: "vertical" }} value={sec.p} maxLength={150} onChange={(e) => setSection(i, "p", e.target.value)} />
                        </FieldWithCount>
                        <ImageUpload
                          label="섹션 이미지"
                          value={sec.img ?? ""}
                          onChange={(v) => setSection(i, "img", v)}
                          inputId={`work-sec-img-${i}`}
                          height={80}
                        />
                      </div>
                    </div>
                  ))}
                </div>
                <button
                  onClick={addSection}
                  style={{ ...btnBase, marginTop: 10, width: "100%", background: "transparent", color: "rgba(10,10,10,.6)", border: "1px dashed rgba(10,10,10,.2)", padding: "10px 14px", textAlign: "center" as const }}
                >
                  + 섹션 추가
                </button>
              </div>

              {/* 관련 인사이트 */}
              <div>
                <label style={labelStyle}>관련 인사이트 (최대 3개)</label>
                <div style={{ display: "flex", flexDirection: "column", gap: 6, maxHeight: 200, overflowY: "auto", padding: "8px 10px", background: "#f9f9f9", borderRadius: 8, border: "1px solid rgba(10,10,10,.1)" }}>
                  {allInsights.length === 0 && (
                    <span style={{ font: "400 13px/1.5 var(--font-sans, sans-serif)", color: "rgba(10,10,10,.4)" }}>등록된 인사이트가 없어요.</span>
                  )}
                  {allInsights.map((ins, idx) => {
                    const selected = (form.relatedInsights ?? []).includes(idx);
                    const atMax = (form.relatedInsights ?? []).length >= 3;
                    return (
                      <label key={idx} style={{ display: "flex", alignItems: "flex-start", gap: 8, cursor: "pointer", padding: "6px 4px", borderRadius: 6, background: selected ? "rgba(10,133,248,.08)" : "transparent" }}>
                        <input
                          type="checkbox"
                          checked={selected}
                          disabled={!selected && atMax}
                          style={{ marginTop: 2, accentColor: "var(--btn-primary)", flexShrink: 0 }}
                          onChange={() => {
                            const prev = form.relatedInsights ?? [];
                            const next = selected ? prev.filter((i) => i !== idx) : [...prev, idx];
                            setForm({ ...form, relatedInsights: next });
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
                {(form.relatedInsights ?? []).length > 0 && (
                  <div style={{ marginTop: 6, font: "400 12px/1 var(--font-sans, sans-serif)", color: "rgba(10,10,10,.45)" }}>
                    {(form.relatedInsights ?? []).length}개 선택됨
                  </div>
                )}
              </div>

              <div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                  <label style={{ ...labelStyle, marginBottom: 0 }}>핵심 포인트 (한 줄에 하나씩)</label>
                  <span style={{ font: "400 11px/1 var(--font-sans, sans-serif)", color: "rgba(10,10,10,.35)" }}>줄당 최대 40자</span>
                </div>
                <textarea
                  style={{ ...inputStyle, height: 80, resize: "vertical" }}
                  value={form.points.join("\n")}
                  onChange={(e) => {
                    const lines = e.target.value.split("\n").map((l) => l.slice(0, 40));
                    setForm({ ...form, points: lines.filter((p) => p.trim()) });
                  }}
                  placeholder={"포인트 1\n포인트 2\n포인트 3"}
                />
              </div>
            </div>

            <div style={{ display: "flex", gap: 10, marginTop: 28, justifyContent: "flex-end" }}>
              <button onClick={closeModal} style={{ ...btnBase, background: "transparent", color: "rgba(10,10,10,.6)", border: "1px solid rgba(10,10,10,.14)" }}>
                취소
              </button>
              <button onClick={handleSave} style={{ ...btnBase, background: "#0a0a0a", color: "#fff", padding: "10px 20px" }}>
                저장
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
