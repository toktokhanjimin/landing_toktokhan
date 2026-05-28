import type { CSSProperties } from "react";

export const overlayStyle: CSSProperties = {
  position: "fixed",
  inset: 0,
  background: "rgba(0,0,0,.45)",
  zIndex: 200,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: 24,
};

export const panelStyle = (maxWidth: number = 620): CSSProperties => ({
  background: "#fff",
  border: "1px solid rgba(10,10,10,.08)",
  borderRadius: 12,
  width: "100%",
  maxWidth,
  maxHeight: "90dvh",
  overflowY: "auto",
  padding: "32px 28px",
});

export const inputStyle: CSSProperties = {
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

export const labelStyle: CSSProperties = {
  font: "500 12px/1 var(--font-sans, sans-serif)",
  color: "rgba(10,10,10,.6)",
  letterSpacing: ".04em",
  marginBottom: 6,
  display: "block",
};

export const btnBase: CSSProperties = {
  font: "500 13px/1 var(--font-sans, sans-serif)",
  padding: "8px 14px",
  borderRadius: 7,
  cursor: "pointer",
  border: "none",
};

export function compressImage(file: File, maxSize = 1200, quality = 0.9): Promise<string> {
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
