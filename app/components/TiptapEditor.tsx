"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import { Node } from "@tiptap/core";
import StarterKit from "@tiptap/starter-kit";
import ImageExt from "@tiptap/extension-image";
import LinkExt from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import Highlight from "@tiptap/extension-highlight";
import { TextStyle } from "@tiptap/extension-text-style";
import Youtube from "@tiptap/extension-youtube";
import { useEffect, useRef } from "react";

/** 링크 카드 에디터용 DOM 직접 생성 (React/NodeView 없음 → 가장 안정적) */
function buildLinkCardDom(attrs: Record<string, string>): HTMLElement {
  const { href = "", title = "", description = "", image = "" } = attrs;

  const dom = document.createElement("div");
  dom.setAttribute("data-link-card", "");
  dom.setAttribute("data-href",  href);
  dom.setAttribute("data-title", title);
  dom.setAttribute("data-desc",  description);
  dom.setAttribute("data-img",   image);
  dom.className = "link-card";

  const body = document.createElement("div");
  body.className = "link-card-body";

  const titleEl = document.createElement("strong");
  titleEl.className = "link-card-title";
  titleEl.textContent = title || href;
  body.appendChild(titleEl);

  if (description) {
    const descEl = document.createElement("p");
    descEl.className = "link-card-desc";
    descEl.textContent = description;
    body.appendChild(descEl);
  }

  const urlEl = document.createElement("span");
  urlEl.className = "link-card-url";
  urlEl.textContent = href;
  body.appendChild(urlEl);

  dom.appendChild(body);

  if (image) {
    const imgWrap = document.createElement("div");
    imgWrap.className = "link-card-img";
    const img = document.createElement("img");
    img.src = image;
    img.alt = "";
    imgWrap.appendChild(img);
    dom.appendChild(imgWrap);
  }

  return dom;
}

/** 링크 카드 커스텀 노드 */
const LinkCard = Node.create({
  name: "linkCard",
  group: "block",
  atom: true,
  selectable: true,
  draggable: true,

  addAttributes() {
    return {
      href:        { default: "" },
      title:       { default: "" },
      description: { default: "" },
      image:       { default: "" },
      siteName:    { default: "" },
    };
  },

  parseHTML() {
    return [{
      tag: "div[data-link-card]",
      getAttrs: (el) => ({
        href:        (el as HTMLElement).getAttribute("data-href")  ?? "",
        title:       (el as HTMLElement).getAttribute("data-title") ?? "",
        description: (el as HTMLElement).getAttribute("data-desc")  ?? "",
        image:       (el as HTMLElement).getAttribute("data-img")   ?? "",
        siteName:    (el as HTMLElement).getAttribute("data-site")  ?? "",
      }),
    }];
  },

  /** getHTML() 직렬화용 — 공개 페이지 normalizeLinkCards()가 <a>로 변환 */
  renderHTML({ HTMLAttributes }) {
    return [
      "div",
      {
        "data-link-card": "",
        "data-href":  HTMLAttributes.href        ?? "",
        "data-title": HTMLAttributes.title       ?? "",
        "data-desc":  HTMLAttributes.description ?? "",
        "data-img":   HTMLAttributes.image       ?? "",
        "data-site":  HTMLAttributes.siteName    ?? "",
        class: "link-card",
      },
    ];
  },

  /** 에디터 내 시각적 렌더 — 순수 DOM 직접 조작 */
  addNodeView() {
    return ({ node }: { node: { attrs: Record<string, string> } }) => {
      const dom = buildLinkCardDom(node.attrs);

      return {
        dom,
        /** attrs가 바뀔 때(OG 메타 도착 등) DOM을 in-place 갱신 */
        update(updatedNode: { type: { name: string }; attrs: Record<string, string> }) {
          if (updatedNode.type.name !== "linkCard") return false;

          const { href = "", title = "", description = "", image = "" } = updatedNode.attrs;

          // data-* 속성 갱신
          dom.setAttribute("data-href",  href);
          dom.setAttribute("data-title", title);
          dom.setAttribute("data-desc",  description);
          dom.setAttribute("data-img",   image);

          // 제목
          const titleEl = dom.querySelector(".link-card-title");
          if (titleEl) titleEl.textContent = title || href;

          // 설명
          const body = dom.querySelector(".link-card-body");
          let descEl = dom.querySelector(".link-card-desc");
          if (description) {
            if (!descEl && body) {
              const urlEl = body.querySelector(".link-card-url");
              const p = document.createElement("p");
              p.className = "link-card-desc";
              p.textContent = description;
              body.insertBefore(p, urlEl);
            } else if (descEl) {
              descEl.textContent = description;
            }
          } else if (descEl) {
            descEl.remove();
          }

          // URL
          const urlEl = dom.querySelector(".link-card-url");
          if (urlEl) urlEl.textContent = href;

          // 이미지 — OG 이미지가 나중에 도착하는 핵심 케이스
          let imgWrap = dom.querySelector(".link-card-img") as HTMLElement | null;
          if (image && !imgWrap) {
            imgWrap = document.createElement("div");
            imgWrap.className = "link-card-img";
            const img = document.createElement("img");
            img.src = image;
            img.alt = "";
            imgWrap.appendChild(img);
            dom.appendChild(imgWrap);
          } else if (image && imgWrap) {
            const img = imgWrap.querySelector("img");
            if (img) img.src = image;
          } else if (!image && imgWrap) {
            imgWrap.remove();
          }

          return true;
        },
      };
    };
  },
});

/** 캡션 포함 이미지 노드 */
const FigureImage = Node.create({
  name: "figureImage",
  group: "block",
  atom: true,
  selectable: true,
  draggable: true,

  addAttributes() {
    return {
      src:     { default: "" },
      alt:     { default: "" },
      caption: { default: "" },
    };
  },

  parseHTML() {
    return [{
      tag: "figure[data-figure-image]",
      getAttrs: (el) => {
        const img = (el as HTMLElement).querySelector("img");
        const cap = (el as HTMLElement).querySelector("figcaption");
        return {
          src:     img?.getAttribute("src")  ?? "",
          alt:     img?.getAttribute("alt")  ?? "",
          caption: cap?.textContent          ?? "",
        };
      },
    }];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      "figure", { "data-figure-image": "", class: "figure-image" },
      ["img", { src: HTMLAttributes.src, alt: HTMLAttributes.alt || "" }],
      ["figcaption", {}, HTMLAttributes.caption || ""],
    ];
  },

  addNodeView() {
    return ({ node, getPos, editor }: { node: { attrs: Record<string, string>; type: { name: string } }; getPos: (() => number | undefined) | undefined; editor: unknown }) => {
      const dom = document.createElement("figure");
      dom.setAttribute("data-figure-image", "");
      dom.className = "figure-image";

      const img = document.createElement("img");
      img.src = node.attrs.src;
      img.alt = node.attrs.alt || "";
      dom.appendChild(img);

      const cap = document.createElement("figcaption");
      cap.contentEditable = "true";
      cap.setAttribute("placeholder", "캡션을 입력하세요...");
      cap.textContent = node.attrs.caption || "";
      dom.appendChild(cap);

      cap.addEventListener("input", () => {
        if (typeof getPos === "function") {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const ed = editor as any;
          ed.view.dispatch(
            ed.state.tr.setNodeMarkup(getPos(), undefined, {
              ...node.attrs,
              caption: cap.textContent || "",
            })
          );
        }
      });

      return {
        dom,
        update(updatedNode: { type: { name: string }; attrs: Record<string, string> }) {
          if (updatedNode.type.name !== "figureImage") return false;
          img.src = updatedNode.attrs.src;
          // 포커스 중엔 textContent 갱신 안 함 (커서 위치 유지)
          if (document.activeElement !== cap && cap.textContent !== updatedNode.attrs.caption) {
            cap.textContent = updatedNode.attrs.caption || "";
          }
          return true;
        },
        stopEvent(event: Event) {
          return cap.contains(event.target as unknown as globalThis.Node);
        },
      };
    };
  },
});

/** · · · 점 구분선 커스텀 노드 */
const DotsDivider = Node.create({
  name: "dotsDivider",
  group: "block",
  atom: true,
  selectable: true,
  parseHTML() {
    return [{ tag: "div[data-dots-divider]" }];
  },
  renderHTML() {
    return ["div", { "data-dots-divider": "", class: "dots-divider" }];
  },
});

interface Props {
  content: string;
  onChange: (html: string) => void;
  onImageUpload?: (file: File) => Promise<string>;
  /** sticky 툴바가 가려지지 않도록 상단 오프셋 지정 (px). 어드민 헤더 높이만큼 설정 */
  stickyTop?: number;
}

type Level = 1 | 2 | 3;

export default function TiptapEditor({ content, onChange, onImageUpload, stickyTop = 0 }: Props) {
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
      Youtube.configure({ width: 640, height: 360, nocookie: true }),
      DotsDivider,
      FigureImage,
      LinkCard,
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
      editor.chain().focus().insertContent({
        type: "figureImage",
        attrs: { src, alt: "", caption: "" },
      }).run();
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

  async function handleLinkCardInsert() {
    const url = window.prompt("링크 URL을 입력하세요", "https://");
    if (!url) return;

    // 1단계: URL 텍스트만으로 즉시 삽입
    editor.chain().focus().insertContent({
      type: "linkCard",
      attrs: { href: url, title: url, description: "", image: "", siteName: "" },
    }).run();

    // 2단계: OG 메타 fetch 후 해당 노드 attrs 업데이트
    try {
      const res = await fetch(`/api/og-fetch?url=${encodeURIComponent(url)}`);
      const data = await res.json();
      if (!data.title) return;

      let targetPos = -1;
      editor.state.doc.descendants((node, pos) => {
        if (node.type.name === "linkCard" && node.attrs.href === url && node.attrs.title === url) {
          targetPos = pos;
        }
      });
      if (targetPos < 0) return;

      editor.view.dispatch(
        editor.state.tr.setNodeMarkup(targetPos, undefined, {
          href:        data.url         || url,
          title:       data.title       || url,
          description: data.description || "",
          image:       data.image       || "",
          siteName:    data.siteName    || "",
        })
      );
    } catch {
      // OG 실패해도 URL 카드 유지
    }
  }

  function handleYoutubeInsert() {
    const url = window.prompt("YouTube URL을 입력하세요", "https://www.youtube.com/watch?v=");
    if (!url) return;
    editor.chain().focus().setYoutubeVideo({ src: url }).run();
  }

  const headingLevel: number = ([1, 2, 3] as Level[]).find(
    (l) => editor.isActive("heading", { level: l })
  ) ?? 0;

  return (
    <div style={{ display: "flex", flexDirection: "column", border: "1px solid rgba(10,10,10,.12)", borderRadius: 10, background: "#fff" }}>
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
        top: stickyTop,
        zIndex: 20,
        borderRadius: "10px 10px 0 0",
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
        <button
          style={{ ...btn(false), letterSpacing: "0.15em", fontSize: 11 }}
          title="점 구분선 삽입"
          onClick={() => {
            const nodeType = editor.schema.nodes.dotsDivider;
            if (!nodeType) return;
            const { state, view } = editor;
            const { selection, tr } = state;
            // 현재 블록(단락 등) 바로 뒤 위치에 삽입
            // ※ doc.content.size는 마지막 블록 '내부' 위치라 사용 불가
            //   doc.nodeSize - 1 이 doc 안쪽 마지막 유효 위치
            const insertPos = Math.min(
              selection.$to.after(),
              state.doc.nodeSize - 1
            );
            view.dispatch(tr.insert(insertPos, nodeType.create()));
            view.focus();
          }}
        >
          ···
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

        {/* 링크 / 이미지 / 유튜브 */}
        <button style={btn(editor.isActive("link"))} onClick={handleSetLink} title="링크">
          🔗
        </button>
        <button
          style={{ ...btn(false), fontSize: 13, letterSpacing: "-.01em" }}
          title="링크 카드 삽입"
          onClick={handleLinkCardInsert}
        >
          🔖
        </button>
        <button
          style={btn(false)}
          title="이미지 삽입"
          onClick={() => imgInputRef.current?.click()}
        >
          🖼
        </button>
        <input ref={imgInputRef} type="file" accept="image/*" style={{ display: "none" }} onChange={handleImageInsert} />
        <button
          style={{ ...btn(false), fontSize: 15 }}
          title="YouTube 영상 삽입"
          onClick={handleYoutubeInsert}
        >
          ▶
        </button>

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
