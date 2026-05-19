"use client";

import { useState, useEffect, CSSProperties } from "react";
import { getWork, saveWork, WorkItem } from "../../lib/store";

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
  sections: [
    { h: "", p: "", grad: "" },
    { h: "", p: "", grad: "" },
    { h: "", p: "", grad: "" },
  ],
  points: [],
  featured: false,
};

function genId() {
  return Math.random().toString(36).slice(2, 10);
}

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

export default function AdminWorkPage() {
  const [items, setItems] = useState<WorkItem[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<WorkItem | null>(null);
  const [form, setForm] = useState<Omit<WorkItem, "id">>(EMPTY_ITEM);

  useEffect(() => {
    setItems(getWork());
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

  function setSection(idx: number, field: "h" | "p" | "grad", val: string) {
    const sections = form.sections.map((s, i) => i === idx ? { ...s, [field]: val } : s);
    setForm({ ...form, sections });
  }

  const btnBase: CSSProperties = {
    font: "500 13px/1 var(--font-sans, sans-serif)",
    padding: "8px 14px",
    borderRadius: 7,
    cursor: "pointer",
    border: "none",
  };

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
              {["Client", "Tag", "Category", "Year", "메인 노출", ""].map((h) => (
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
                <td style={{ padding: "14px 16px", font: "600 14px/1 var(--font-sans, sans-serif)", color: "#0a0a0a" }}>
                  {item.client}
                </td>
                <td style={{ padding: "14px 16px", font: "400 13px/1 var(--font-sans, sans-serif)", color: "rgba(10,10,10,.7)" }}>
                  {item.tag}
                </td>
                <td style={{ padding: "14px 16px" }}>
                  <span style={{
                    font: "500 11px/1 var(--font-sans, sans-serif)",
                    padding: "4px 8px",
                    borderRadius: 5,
                    background: "rgba(10,10,10,.06)",
                    color: "#0a0a0a",
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
                <td colSpan={6} style={{ padding: "40px 16px", textAlign: "center", font: "400 14px/1 var(--font-sans, sans-serif)", color: "rgba(10,10,10,.35)" }}>
                  콘텐츠가 없어요. 추가해보세요.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {modalOpen && (
        <div style={overlayStyle} onClick={(e) => { if (e.target === e.currentTarget) closeModal(); }}>
          <div style={panelStyle}>
            <h2 style={{ font: "700 20px/1.2 var(--font-sans, sans-serif)", color: "#0a0a0a", margin: "0 0 24px" }}>
              {editing ? "케이스 수정" : "케이스 추가"}
            </h2>

            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div>
                  <label style={labelStyle}>Client</label>
                  <input
                    style={inputStyle}
                    value={form.client}
                    onChange={(e) => setForm({ ...form, client: e.target.value })}
                    placeholder="BLUEGARAGE"
                  />
                </div>
                <div>
                  <label style={labelStyle}>Tag</label>
                  <input
                    style={inputStyle}
                    value={form.tag}
                    onChange={(e) => setForm({ ...form, tag: e.target.value })}
                    placeholder="JYP360"
                  />
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
                <div>
                  <label style={labelStyle}>Category</label>
                  <select
                    style={inputStyle}
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                  >
                    <option value="AX">AX</option>
                    <option value="AI">AI</option>
                    <option value="Ops">Ops</option>
                  </select>
                </div>
                <div>
                  <label style={labelStyle}>Year</label>
                  <input
                    style={inputStyle}
                    value={form.year}
                    onChange={(e) => setForm({ ...form, year: e.target.value })}
                    placeholder="2026"
                  />
                </div>
                <div>
                  <label style={labelStyle}>Date</label>
                  <input
                    style={inputStyle}
                    value={form.date}
                    onChange={(e) => setForm({ ...form, date: e.target.value })}
                    placeholder="2026.03.18"
                  />
                </div>
              </div>

              <div>
                <label style={labelStyle}>Title</label>
                <input
                  style={inputStyle}
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="프로젝트 제목"
                />
              </div>

              <div>
                <label style={labelStyle}>Lead (소개 문구)</label>
                <textarea
                  style={{ ...inputStyle, height: 80, resize: "vertical" }}
                  value={form.lead}
                  onChange={(e) => setForm({ ...form, lead: e.target.value })}
                  placeholder="프로젝트 소개..."
                />
              </div>

              {form.sections.map((sec, i) => (
                <div key={i} style={{ padding: "16px", background: "#f9f9f9", borderRadius: 8 }}>
                  <div style={{ font: "600 12px/1 var(--font-sans, sans-serif)", color: "rgba(10,10,10,.5)", marginBottom: 12, letterSpacing: ".06em" }}>
                    섹션 {i + 1}
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                    <div>
                      <label style={labelStyle}>제목 (h)</label>
                      <input
                        style={inputStyle}
                        value={sec.h}
                        onChange={(e) => setSection(i, "h", e.target.value)}
                        placeholder="문제 / 접근 / 결과"
                      />
                    </div>
                    <div>
                      <label style={labelStyle}>내용 (p)</label>
                      <textarea
                        style={{ ...inputStyle, height: 72, resize: "vertical" }}
                        value={sec.p}
                        onChange={(e) => setSection(i, "p", e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              ))}

              <div>
                <label style={labelStyle}>핵심 포인트 (한 줄에 하나씩)</label>
                <textarea
                  style={{ ...inputStyle, height: 80, resize: "vertical" }}
                  value={form.points.join("\n")}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      points: e.target.value.split("\n").filter((p) => p.trim()),
                    })
                  }
                  placeholder={"포인트 1\n포인트 2\n포인트 3"}
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
