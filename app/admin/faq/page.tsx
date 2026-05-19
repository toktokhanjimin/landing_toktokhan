"use client";

import { useState, useEffect, CSSProperties } from "react";
import { getFAQs, saveFAQs, FAQItem } from "../../lib/store";

const btnBase: CSSProperties = {
  font: "500 13px/1 var(--font-sans, sans-serif)",
  padding: "7px 12px",
  borderRadius: 7,
  cursor: "pointer",
  border: "none",
};

const textareaStyle: CSSProperties = {
  width: "100%",
  font: "400 14px/1.6 var(--font-sans, sans-serif)",
  padding: "10px 12px",
  border: "1px solid rgba(10,10,10,.14)",
  borderRadius: 8,
  color: "#0a0a0a",
  background: "#fff",
  outline: "none",
  resize: "vertical",
  boxSizing: "border-box",
};

export default function AdminFAQPage() {
  const [items, setItems] = useState<FAQItem[]>([]);
  const [openIdx, setOpenIdx] = useState<number | null>(null);
  const [editIdx, setEditIdx] = useState<number | null>(null);
  const [editQ, setEditQ] = useState("");
  const [editA, setEditA] = useState("");

  useEffect(() => {
    setItems(getFAQs());
  }, []);

  function persist(updated: FAQItem[]) {
    saveFAQs(updated);
    setItems(updated);
  }

  function handleAdd() {
    const updated = [...items, { q: "새 질문", a: "답변을 입력하세요." }];
    persist(updated);
    const newIdx = updated.length - 1;
    startEdit(newIdx, updated[newIdx]);
    setOpenIdx(newIdx);
  }

  function handleDelete(idx: number) {
    if (!confirm("정말 삭제하시겠어요?")) return;
    const updated = items.filter((_, i) => i !== idx);
    persist(updated);
    if (editIdx === idx) setEditIdx(null);
    if (openIdx === idx) setOpenIdx(null);
  }

  function moveUp(idx: number) {
    if (idx === 0) return;
    const updated = [...items];
    [updated[idx - 1], updated[idx]] = [updated[idx], updated[idx - 1]];
    persist(updated);
    if (editIdx === idx) setEditIdx(idx - 1);
    else if (editIdx === idx - 1) setEditIdx(idx);
  }

  function moveDown(idx: number) {
    if (idx === items.length - 1) return;
    const updated = [...items];
    [updated[idx], updated[idx + 1]] = [updated[idx + 1], updated[idx]];
    persist(updated);
    if (editIdx === idx) setEditIdx(idx + 1);
    else if (editIdx === idx + 1) setEditIdx(idx);
  }

  function startEdit(idx: number, item: FAQItem) {
    setEditIdx(idx);
    setEditQ(item.q);
    setEditA(item.a);
  }

  function saveEdit(idx: number) {
    const updated = items.map((it, i) =>
      i === idx ? { q: editQ, a: editA } : it
    );
    persist(updated);
    setEditIdx(null);
  }

  function cancelEdit() {
    setEditIdx(null);
  }

  function toggleOpen(idx: number) {
    setOpenIdx(openIdx === idx ? null : idx);
  }

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 28 }}>
        <div>
          <h1 style={{ font: "700 24px/1.2 var(--font-sans, sans-serif)", letterSpacing: "-.02em", color: "#0a0a0a", margin: "0 0 4px" }}>
            FAQ
          </h1>
          <p style={{ font: "400 13px/1 var(--font-sans, sans-serif)", color: "rgba(10,10,10,.45)", margin: 0 }}>
            {items.length}개의 질문
          </p>
        </div>
        <button
          onClick={handleAdd}
          style={{ ...btnBase, background: "#0a0a0a", color: "#fff", padding: "10px 18px" }}
        >
          + 추가
        </button>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {items.map((item, idx) => {
          const isOpen = openIdx === idx;
          const isEditing = editIdx === idx;

          return (
            <div
              key={idx}
              style={{
                background: "#fff",
                border: "1px solid rgba(10,10,10,.08)",
                borderRadius: 12,
                overflow: "hidden",
              }}
            >
              {/* Header row */}
              <div style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                padding: "14px 16px",
              }}>
                {/* Order controls */}
                <div style={{ display: "flex", flexDirection: "column", gap: 2, flexShrink: 0 }}>
                  <button
                    onClick={() => moveUp(idx)}
                    disabled={idx === 0}
                    style={{
                      ...btnBase,
                      padding: "3px 8px",
                      background: "transparent",
                      color: idx === 0 ? "rgba(10,10,10,.2)" : "rgba(10,10,10,.5)",
                      border: "1px solid rgba(10,10,10,.12)",
                      fontSize: 11,
                    }}
                  >
                    ↑
                  </button>
                  <button
                    onClick={() => moveDown(idx)}
                    disabled={idx === items.length - 1}
                    style={{
                      ...btnBase,
                      padding: "3px 8px",
                      background: "transparent",
                      color: idx === items.length - 1 ? "rgba(10,10,10,.2)" : "rgba(10,10,10,.5)",
                      border: "1px solid rgba(10,10,10,.12)",
                      fontSize: 11,
                    }}
                  >
                    ↓
                  </button>
                </div>

                {/* Question preview / toggle */}
                <button
                  onClick={() => { toggleOpen(idx); if (!isEditing) { /* just toggle */ } }}
                  style={{
                    flex: 1,
                    background: "transparent",
                    border: "none",
                    cursor: "pointer",
                    textAlign: "left",
                    font: `${isOpen ? 600 : 500} 15px/1.4 var(--font-sans, sans-serif)`,
                    color: "#0a0a0a",
                    padding: 0,
                  }}
                >
                  <span style={{
                    font: "500 11px/1 var(--font-sans, sans-serif)",
                    color: "rgba(10,10,10,.35)",
                    marginRight: 10,
                    letterSpacing: ".04em",
                  }}>
                    Q{String(idx + 1).padStart(2, "0")}
                  </span>
                  {item.q}
                </button>

                {/* Action buttons */}
                <div style={{ display: "flex", gap: 6, flexShrink: 0 }}>
                  <button
                    onClick={() => {
                      startEdit(idx, item);
                      setOpenIdx(idx);
                    }}
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

              {/* Body (expanded) */}
              {isOpen && (
                <div style={{ borderTop: "1px solid rgba(10,10,10,.06)", padding: "16px 20px" }}>
                  {isEditing ? (
                    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                      <div>
                        <label style={{
                          font: "500 11px/1 var(--font-sans, sans-serif)",
                          color: "rgba(10,10,10,.45)",
                          letterSpacing: ".05em",
                          display: "block",
                          marginBottom: 6,
                        }}>
                          질문 (Q)
                        </label>
                        <textarea
                          style={{ ...textareaStyle, height: 56 }}
                          value={editQ}
                          onChange={(e) => setEditQ(e.target.value)}
                        />
                      </div>
                      <div>
                        <label style={{
                          font: "500 11px/1 var(--font-sans, sans-serif)",
                          color: "rgba(10,10,10,.45)",
                          letterSpacing: ".05em",
                          display: "block",
                          marginBottom: 6,
                        }}>
                          답변 (A)
                        </label>
                        <textarea
                          style={{ ...textareaStyle, height: 100 }}
                          value={editA}
                          onChange={(e) => setEditA(e.target.value)}
                        />
                      </div>
                      <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
                        <button
                          onClick={cancelEdit}
                          style={{ ...btnBase, background: "transparent", color: "rgba(10,10,10,.55)", border: "1px solid rgba(10,10,10,.14)" }}
                        >
                          취소
                        </button>
                        <button
                          onClick={() => saveEdit(idx)}
                          style={{ ...btnBase, background: "#0a0a0a", color: "#fff" }}
                        >
                          저장
                        </button>
                      </div>
                    </div>
                  ) : (
                    <p style={{
                      font: "400 14px/1.7 var(--font-sans, sans-serif)",
                      color: "rgba(10,10,10,.7)",
                      margin: 0,
                    }}>
                      {item.a}
                    </p>
                  )}
                </div>
              )}
            </div>
          );
        })}

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
            FAQ가 없어요. 추가해보세요.
          </div>
        )}
      </div>
    </div>
  );
}
