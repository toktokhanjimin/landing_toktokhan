"use client";

import * as Select from "@radix-ui/react-select";
import type { CSSProperties } from "react";

const chevron = (
  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" style={{ flexShrink: 0 }}>
    <path d="M2.5 4.5L6 8L9.5 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const check = (
  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
    <path d="M2 6L5 9L10 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

interface AdminSelectProps {
  value: string;
  onValueChange: (v: string) => void;
  options: { value: string; label: string }[];
  placeholder?: string;
}

export default function AdminSelect({ value, onValueChange, options, placeholder = "선택" }: AdminSelectProps) {
  const triggerStyle: CSSProperties = {
    width: "100%",
    height: 38,
    padding: "0 10px",
    borderRadius: 8,
    border: "1px solid rgba(10,10,10,.14)",
    background: "#fff",
    font: "400 13px/1 var(--font-sans, sans-serif)",
    color: value ? "#0a0a0a" : "rgba(10,10,10,.35)",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 6,
    cursor: "pointer",
    outline: "none",
    transition: "border-color .15s",
    boxSizing: "border-box",
  };

  const contentStyle: CSSProperties = {
    background: "#fff",
    borderRadius: 10,
    border: "1px solid rgba(10,10,10,.1)",
    boxShadow: "0 8px 24px rgba(0,0,0,.1), 0 2px 8px rgba(0,0,0,.06)",
    padding: "6px",
    zIndex: 9999,
    minWidth: "var(--radix-select-trigger-width)",
    maxHeight: "var(--radix-select-content-available-height)",
    overflowY: "auto",
  };

  const itemStyle: CSSProperties = {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "8px 10px",
    borderRadius: 7,
    font: "400 13px/1 var(--font-sans, sans-serif)",
    color: "#0a0a0a",
    cursor: "pointer",
    outline: "none",
    userSelect: "none",
  };

  return (
    <>
      <style>{`
        [data-radix-select-item]:hover,
        [data-radix-select-item][data-highlighted] {
          background: rgba(10,10,10,.05) !important;
        }
        [data-radix-select-item][data-state="checked"] {
          font-weight: 600 !important;
          color: #0a0a0a !important;
        }
        [data-radix-select-trigger]:focus {
          border-color: rgba(10,10,10,.4) !important;
        }
      `}</style>
      <Select.Root value={value} onValueChange={onValueChange}>
        <Select.Trigger style={triggerStyle} data-radix-select-trigger="">
          <Select.Value placeholder={placeholder} />
          <Select.Icon>{chevron}</Select.Icon>
        </Select.Trigger>

        <Select.Portal>
          <Select.Content style={contentStyle} position="popper" sideOffset={4}>
            <Select.Viewport>
              {options.map((opt) => (
                <Select.Item
                  key={opt.value}
                  value={opt.value}
                  style={itemStyle}
                  data-radix-select-item=""
                >
                  <Select.ItemText>{opt.label}</Select.ItemText>
                  <Select.ItemIndicator>{check}</Select.ItemIndicator>
                </Select.Item>
              ))}
            </Select.Viewport>
          </Select.Content>
        </Select.Portal>
      </Select.Root>
    </>
  );
}
