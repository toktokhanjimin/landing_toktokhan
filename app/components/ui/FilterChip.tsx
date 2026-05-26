"use client";

import { CSSProperties } from "react";

interface FilterChipProps {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}

const chipStyle = (on: boolean): CSSProperties => ({
  font: "500 14px/1 var(--font-sans)",
  padding: "10px 16px",
  borderRadius: "var(--r-sm)",
  border: on ? "1px solid #0a0a0a" : "1px solid rgba(10,10,10,.14)",
  background: on ? "var(--bg-dark)" : "transparent",
  color: on ? "var(--fg-on-dark-1)" : "rgba(10,10,10,.7)",
  cursor: "pointer",
});

export default function FilterChip({ active, onClick, children }: FilterChipProps) {
  return (
    <button style={chipStyle(active)} onClick={onClick}>
      {children}
    </button>
  );
}
