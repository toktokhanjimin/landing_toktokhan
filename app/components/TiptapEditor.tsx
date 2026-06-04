"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import ImageExt from "@tiptap/extension-image";
import LinkExt from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import Highlight from "@tiptap/extension-highlight";
import { TextStyle } from "@tiptap/extension-text-style";
import { useEffect, useRef } from "react";

interface Props {
  content: string;
  onChange: (html: string) => void;
  onImageUpload?: (file: File) => Promise<string>;
}

type Level = 1 | 2 | 3;

export default function TiptapEditor({ content, onChange, onImageUpload }: Props) {
  const imgInputRef = useRef<HTMLInputElement>(null);

  const editor = useEditor({
    extensions: [
      StarterKit,
      ImageExt.configure({ inline: false }),
      LinkExt.configure({ openOnClick: false, HTMLAttributes: { target: "_blank", rel: "noopener noreferrer" } }),
      Placeholder.configure({ placeholder: "내용을 입력하세요..." }),
      Underline,
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      Highlight.configure({ multicolor: false }),
      TextStyle,
    ],
    content,
    editorProps: {
      attributes: {
        class: "tiptap-editor-area",
      },
    },
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  // 외부 content 변경 시 동기화 (편집 중엔 무시)
  useEffect(() => {
    if (!editor || editor.isFocused) return;
    const current = editor.getHTML();
    if (content !== current) {
      editor.commands.setContent(content || "", { emitUpdate: false });
    }
  }, [content, editor]);

  if (!editor) return null;

  const btn = (active: boolean) => ({
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    width: 30,
    height: 28,
    borderRadius: 5,
    border: "none",
    background: active ? "rgba(10,10,10,.1)" : "transparent",
    color: active ? "#0a0a0a" : "rgba(10,10,10,.6)",
    cursor: "pointer",
    font: "500 13px/1 var(--font-sans, sans-serif)",
    transition: "background .15s",
    flexShrink: 0,
  } as React.CSSProperties);

  const sep = (
    <div style={{ width: 1, height: 18, background: "rgba(10,10,10,.12)", margin: "0 2px", flexShrink: 0 }} />
  );

  async function handleImageInsert(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file || !editor) return;
    try {
      let src: string;
      if (onImageUpload) {
        src = await onImageUpload(file);
      } else {
        src = await new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          reader.readAsDataURL(file);
        });
      }
      editor.chain().focus().setImage({ src }).run();
    } catch {
      alert("이미지 업로드에 실패했어요.");
    }
    e.target.value = "";
  }

  function handleSetLink() {
    const prev = editor.getAttributes("link").href as string | undefined;
    const url = window.prompt("링크 URL", prev ?? "https://");
    if (url === null) return;
    if (!url) { editor.chain().focus().unsetLink().run(); return; }
    editor.chain().focus().setLink({ href: url }).run();
  }

  const headingLevel: number = ([1, 2, 3] as Level[]).find(
    (l) => editor.isActive("heading", { level: l })
  ) ?? 0;

  return (
    <div style={{ display: "flex", flexDirection: "column", border: "1px solid rgba(10,10,10,.12)", borderRadius: 10, overflow: "hidden", background: "#fff" }}>
      {/* ── 툴바 ── */}
      <div style={{
        display: "flex",
        flexWrap: "wrap",
        alignItems: "center",
        gap: 2,
        padding: "8px 10px",
        borderBottom: "1px solid rgba(10,10,10,.08)",
        background: "#fafafa",
        position: "sticky",
        top: 0,
        zIndex: 10,
      }}>
        {/* 단락 / 제목 */}
        <select
          value={headingLevel}
          onChange={(e) => {
            const v = Number(e.target.value);
            if (v === 0) editor.chain().focus().setParagraph().run();
            else editor.chain().focus().setHeading({ level: v as Level }).run();
          }}
          style={{
            height: 28,
            border: "1px solid rgba(10,10,10,.12)",
            borderRadius: 5,
            font: "500 12px/1 var(--font-sans, sans-serif)",
            color: "#0a0a0a",
            background: "#fff",
            cursor: "pointer",
            padding: "0 6px",
            flexShrink: 0,
          }}
        >
          <option value={0}>본문</option>
          <option value={1}>제목 1</option>
          <option value={2}>제목 2</option>
          <option value={3}>제목 3</option>
        </select>

        {sep}

        {/* 인라인 서식 */}
        <button style={btn(editor.isActive("bold"))} onClick={() => editor.chain().focus().toggleBold().run()} title="굵게">
          <b>B</b>
        </button>
        <button style={btn(editor.isActive("italic"))} onClick={() => editor.chain().focus().toggleItalic().run()} title="기울임">
          <i>I</i>
        </button>
        <button style={btn(editor.isActive("underline"))} onClick={() => editor.chain().focus().toggleUnderline().run()} title="밑줄">
          <u>U</u>
        </button>
        <button style={btn(editor.isActive("strike"))} onClick={() => editor.chain().focus().toggleStrike().run()} title="취소선">
          <s>S</s>
        </button>
        <button style={btn(editor.isActive("code"))} onClick={() => editor.chain().focus().toggleCode().run()} title="인라인 코드">
          {"<>"}
        </button>
        <button style={btn(editor.isActive("highlight"))} onClick={() => editor.chain().focus().toggleHighlight().run()} title="형광펜">
          H
        </button>

        {sep}

        {/* 리스트 */}
        <button style={btn(editor.isActive("bulletList"))} onClick={() => editor.chain().focus().toggleBulletList().run()} title="목록">
          ≡
        </button>
        <button style={btn(editor.isActive("orderedList"))} onClick={() => editor.chain().focus().toggleOrderedList().run()} title="번호 목록">
          #
        </button>

        {sep}

        {/* 블록 */}
        <button style={btn(editor.isActive("blockquote"))} onClick={() => editor.chain().focus().toggleBlockquote().run()} title="인용">
          "
        </button>
        <button style={btn(editor.isActive("codeBlock"))} onClick={() => editor.chain().focus().toggleCodeBlock().run()} title="코드 블록">
          {"{ }"}
        </button>
        <button style={btn(false)} onClick={() => editor.chain().focus().setHorizontalRule().run()} title="구분선">
          ─
        </button>

        {sep}

        {/* 정렬 */}
        <button style={btn(editor.isActive({ textAlign: "left" }))} onClick={() => editor.chain().focus().setTextAlign("left").run()} title="왼쪽 정렬">
          ←
        </button>
        <button style={btn(editor.isActive({ textAlign: "center" }))} onClick={() => editor.chain().focus().setTextAlign("center").run()} title="가운데 정렬">
          ↔
        </button>
        <button style={btn(editor.isActive({ textAlign: "right" }))} onClick={() => editor.chain().focus().setTextAlign("right").run()} title="오른쪽 정렬">
          →
        </button>

        {sep}

        {/* 링크 / 이미지 */}
        <button style={btn(editor.isActive("link"))} onClick={handleSetLink} title="링크">
          🔗
        </button>
        <button
          style={btn(false)}
          title="이미지 삽입"
          onClick={() => imgInputRef.current?.click()}
        >
          🖼
        </button>
        <input ref={imgInputRef} type="file" accept="image/*" style={{ display: "none" }} onChange={handleImageInsert} />

        {sep}

        {/* 실행취소/다시실행 */}
        <button style={btn(false)} onClick={() => editor.chain().focus().undo().run()} title="실행취소">
          ↩
        </button>
        <button style={btn(false)} onClick={() => editor.chain().focus().redo().run()} title="다시실행">
          ↪
        </button>
      </div>

      {/* ── 에디터 본문 ── */}
      <EditorContent
        editor={editor}
        style={{ flex: 1, minHeight: 420, padding: "20px 24px", fontSize: 15 }}
      />
    </div>
  );
}
