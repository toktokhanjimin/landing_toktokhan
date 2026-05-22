"use client";

import { CSSProperties, ReactNode } from "react";

type Variant = "primary" | "secondary" | "outline" | "ghost";
type Size = "sm" | "md" | "lg";

interface ButtonProps {
  variant?: Variant;
  size?: Size;
  children: ReactNode;
  href?: string;
  onClick?: (e: React.MouseEvent) => void;
  target?: string;
  rel?: string;
  disabled?: boolean;
  style?: CSSProperties;
  className?: string;
  type?: "button" | "submit" | "reset";
}

const variantStyles: Record<Variant, CSSProperties> = {
  primary:   { background: "var(--btn-primary)",  color: "var(--on-brand)",       border: "none" },
  secondary: { background: "#2c2c2e",              color: "var(--fg-on-dark-1)",   border: "none" },
  outline:   { background: "var(--bg)",            color: "var(--fg-1)",           border: "1px solid rgba(10,10,10,.12)" },
  ghost:     { background: "var(--bg-elev)",       color: "var(--fg-1)",           border: "none" },
};

const sizeStyles: Record<Size, CSSProperties> = {
  sm: { padding: "8px 14px",  font: "500 13px/1 var(--font-sans)" },
  md: { padding: "12px 18px", font: "500 14px/1 var(--font-sans)" },
  lg: { padding: "14px 22px", font: "500 15px/1 var(--font-sans)" },
};

export default function Button({
  variant = "primary",
  size = "md",
  children,
  href,
  onClick,
  target,
  rel,
  disabled,
  style,
  className,
  type = "button",
}: ButtonProps) {
  const base: CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    gap: 8,
    borderRadius: "var(--r-sm)",
    cursor: disabled ? "default" : "pointer",
    textDecoration: "none",
    whiteSpace: "nowrap",
    flexShrink: 0,
    opacity: disabled ? 0.45 : 1,
    ...variantStyles[variant],
    ...sizeStyles[size],
    ...style,
  };

  if (href) {
    return (
      <a href={href} style={base} className={className} target={target} rel={rel} onClick={onClick}>
        {children}
      </a>
    );
  }

  return (
    <button type={type} style={base} className={className} onClick={onClick} disabled={disabled}>
      {children}
    </button>
  );
}
