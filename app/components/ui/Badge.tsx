import { CSSProperties, ReactNode } from "react";

type BadgeVariant = "default" | "dark" | "primary";

interface BadgeProps {
  children: ReactNode;
  variant?: BadgeVariant;
  style?: CSSProperties;
  className?: string;
}

const variantStyles: Record<BadgeVariant, CSSProperties> = {
  default: { background: "var(--bg)",        color: "var(--grey-800)" },
  dark:    { background: "var(--bg-dark)",   color: "var(--fg-on-dark-1)" },
  primary: { background: "var(--primary-50)", color: "var(--primary-700)" },
};

export default function Badge({ children, variant = "default", style, className }: BadgeProps) {
  return (
    <span
      className={className}
      style={{
        display: "inline-block",
        alignSelf: "flex-start",
        font: "600 12px/1 var(--font-sans)",
        letterSpacing: ".04em",
        padding: "6px 8px",
        borderRadius: "var(--r-sm)",
        whiteSpace: "nowrap",
        ...variantStyles[variant],
        ...style,
      }}
    >
      {children}
    </span>
  );
}
