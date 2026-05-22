import React, { CSSProperties, ReactNode } from "react";

interface ContainerProps {
  children: ReactNode;
  style?: CSSProperties;
  className?: string;
  as?: keyof React.JSX.IntrinsicElements;
}

export default function Container({ children, style, className, as: Tag = "div" }: ContainerProps) {
  return (
    <Tag
      style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px", ...style }}
      className={className}
    >
      {children}
    </Tag>
  );
}
