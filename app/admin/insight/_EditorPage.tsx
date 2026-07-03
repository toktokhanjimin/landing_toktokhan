"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import type { InsightItem } from "../../lib/store";
import { toSlug } from "../../lib/slug";
import { inputStyle, textareaStyle, labelStyle, btnBase } from "../adminStyles";
import AdminSelect from "../AdminSelect";

const CATEGORY_OPTIONS = [
  { value: "ax",       label: "AX"       },
  { value: "team",     label: "팀문화"   },
  { value: "outsource", label: "외주개발팁" },
  { value: "launch",   label: "런칭"     },
];

const TAG_OPTIONS = [
  { value: "기술 블로그", label: "기술 블로그" },
  { value: "링크드인",   label: "링크드인"     },
  { value: "유튜브",     label: "유튜브"       },
  { value: "아티클",     label: "아티클"       },
];

const TiptapEditor = dynamic(() => import("../../components/TiptapEditor"), { ssr: false });

const CATEGORY_CONFIG: Record<string, { thumb: string; img?: string }> = {
  ax:        { thumb: "linear-gradient(135deg,#38BDF8,#6366F1)" },
  team:      { thumb: "linear-gradient(135deg,#34D399,#059669)" },
  outsource: { thumb: "linear-gradient(135deg,#8B5CF6,#3B82F6)" },
  launch:    { thumb: "linear-gradient(135deg,#F59E0B,#EF4444)" },
};

const EMPTY: Omit<InsightItem, "id"> = {
  mark: "", markColor: "#0a0a0a",
  thumb: CATEGORY_CONFIG.ax.thumb, thumbImg: CATEGORY_CONFIG.ax.img,
  title: "", slug: "", tag: "기술 블로그", category: "ax",
  date: new Date().toISOString().slice(0, 10),
  excerpt: "", url: "", body: "", featured: false,
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

interface Props {
  mode: "new" | "edit";
  id?: string;
}

export default function InsightEditorPage({ mode, id }: Props) {
  const router = useRouter();
  const [form, setForm] = useState<Omit<InsightItem, "id">>(EMPTY);
  const [loading, setLoading] = useState(mode === "edit");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (mode !== "edit" || !id) return;
    fetch(`/api/admin/insight/${id}`)
      .then((r) => r.json())
      .then((row) => {
        setForm({
          mark:       row.mark ?? "",
          markColor:  row.mark_color ?? "#0a0a0a",
          thumb:      row.thumb ?? "",
          thumbImg:   row.thumb_img ?? "",
          title:      row.title ?? "",
          slug:       row.slug ?? "",
          tag:        row.tag ?? "기술 블로그",
          category:   row.category ?? "ax",
          date:       row.date ?? "",
          excerpt:    row.excerpt ?? "",
          url:        row.url ?? "",
          body:       row.body ?? "",
          featured:   row.featured ?? false,
        });
        setLoading(false);
      })
      .catch(() => { alert("데이터를 불러오지 못했어요."); router.push("/admin/insight"); });
  }, [mode, id]);

  async function handleSave() {
    if (!form.title.trim()) { alert("제목을 입력해주세요."); return; }
    setSaving(true);
    try {
      const payload = {
        mark:       form.mark,
        mark_color: form.markColor,
        thumb:      form.thumb,
        thumb_img:  form.thumbImg ?? "",
        title:      form.title,
        slug:       form.slug || toSlug(form.title),
        tag:        form.tag,
        category:   form.category ?? "ax",
        date:       form.date,
        excerpt:    form.excerpt,
        url:        form.url ?? "",
        body:       form.body ?? "",
        featured:   form.featured ?? false,
      };

      if (mode === "edit" && id) {
        await fetch(`/api/admin/insight/${id}`, {
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
      router.push("/admin/insight");
    } catch (err) {
      alert("저장에 실패했어요.");
      console.error(err);
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: 300, color: "rgba(10,10,10,.35)", font: "400 14px/1 var(--font-sans, sans-serif)" }}>
        불러오는 중...
      </div>
    );
  }

  return (
    <div>
      {/* ── 상단 헤더 ── sticky + full-bleed (main padding 40px 상쇄) */}
      <div style={{
        position: "sticky",
        top: 0,
        zIndex: 50,
        display: "flex",
        alignItems: "center",
        gap: 16,
        margin: "-40px -40px 32px -40px",
        padding: "12px 40px",
        background: "var(--grey-100)",
        borderBottom: "1px solid rgba(10,10,10,.08)",
      }}>
        <button
          onClick={() => router.push("/admin/insight")}
          style={{ ...btnBase, background: "transparent", color: "rgba(10,10,10,.5)", border: "1px solid rgba(10,10,10,.14)", padding: "8px 14px", font: "400 13px/1 var(--font-sans, sans-serif)" }}
        >
          ← 목록
        </button>
        <h1 style={{ font: "700 22px/1.2 var(--font-sans, sans-serif)", color: "#0a0a0a", margin: 0, flex: 1 }}>
          {mode === "edit" ? "인사이트 수정" : "새 인사이트"}
        </h1>
        <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }}>
          <input
            type="checkbox"
            checked={form.featured ?? false}
            onChange={(e) => setForm((f) => ({ ...f, featured: e.target.checked }))}
          />
          <span style={{ font: "500 13px/1 var(--font-sans, sans-serif)", color: "rgba(10,10,10,.7)" }}>노출</span>
        </label>
        <button
          onClick={handleSave}
          disabled={saving}
          style={{ ...btnBase, background: saving ? "rgba(10,10,10,.4)" : "#0a0a0a", color: "#fff", padding: "10px 22px" }}
        >
          {saving ? "저장 중..." : "저장"}
        </button>
      </div>

      {/* ── 2단 레이아웃 ── */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 280px", gap: 24, alignItems: "start" }}>
        {/* ── 에디터 영역 ── */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {/* 제목 */}
          <input
            style={{
              ...inputStyle,
              font: "700 22px/1.3 var(--font-sans, sans-serif)",
              padding: "14px 16px",
              letterSpacing: "-.02em",
              color: "#0a0a0a",
            }}
            value={form.title}
            onChange={(e) => {
              const title = e.target.value;
              setForm((f) => ({
                ...f,
                title,
                // slug가 비어있거나 직전 title로부터 자동생성된 경우에만 갱신
                slug: f.slug === toSlug(f.title) || f.slug === "" ? toSlug(title) : f.slug,
              }));
            }}
            placeholder="아티클 제목"
          />

          {/* URL 슬러그 */}
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ font: "400 13px/1 var(--font-sans, sans-serif)", color: "rgba(10,10,10,.4)", flexShrink: 0 }}>
              /insight/
            </span>
            <input
              style={{ ...inputStyle, font: "400 13px/1 var(--font-mono, monospace)", color: "rgba(10,10,10,.7)", flex: 1 }}
              value={form.slug ?? ""}
              onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))}
              placeholder="url-slug"
            />
          </div>

          {/* Tiptap 에디터 */}
          <TiptapEditor
            content={form.body ?? ""}
            onChange={(html) => setForm((f) => ({ ...f, body: html }))}
            onImageUpload={uploadImage}
            stickyTop={58}
          />
        </div>

        {/* ── 메타 사이드바 ── */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16, background: "#fff", border: "1px solid rgba(10,10,10,.08)", borderRadius: 12, padding: 20 }}>
          {/* 카테고리 */}
          <div>
            <label style={labelStyle}>카테고리</label>
            <AdminSelect
              value={form.category ?? "log"}
              onValueChange={(cat) => {
                const cfg = CATEGORY_CONFIG[cat];
                setForm((f) => ({ ...f, category: cat, thumb: cfg?.thumb ?? f.thumb, thumbImg: cfg?.img ?? "" }));
              }}
              options={CATEGORY_OPTIONS}
            />
          </div>

          <div>
            <label style={labelStyle}>태그</label>
            <AdminSelect
              value={form.tag}
              onValueChange={(v) => setForm((f) => ({ ...f, tag: v }))}
              options={TAG_OPTIONS}
            />
          </div>

          <div>
            <label style={labelStyle}>날짜</label>
            <input style={inputStyle} type="date" value={form.date} onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))} />
          </div>

          <div>
            <label style={labelStyle}>요약 (excerpt)</label>
            <textarea
              style={{ ...textareaStyle, height: 90 }}
              value={form.excerpt}
              onChange={(e) => setForm((f) => ({ ...f, excerpt: e.target.value }))}
              placeholder="목록에 표시되는 짧은 요약..."
            />
          </div>

        </div>
      </div>
    </div>
  );
}
