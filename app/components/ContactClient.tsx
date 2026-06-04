"use client";

import { useState } from "react";

interface Props {
  formUrl: string;
  title: string;
  description: string;
  fallbackLabel: string;
}

export default function ContactClient({ formUrl, title, description, fallbackLabel }: Props) {
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);

  return (
    <div style={{ position: "fixed", inset: 0, background: "#fff" }}>
      {!failed ? (
        <>
          {!loaded && (
            <div style={{
              position: "absolute", top: "50%", left: "50%",
              transform: "translate(-50%, -50%)",
              display: "flex", flexDirection: "column", alignItems: "center", gap: 16,
            }}>
              <div style={{
                width: 28, height: 28, borderRadius: "50%",
                border: "2.5px solid rgba(10,10,10,.1)",
                borderTopColor: "#0a0a0a",
                animation: "spin .7s linear infinite",
              }} />
              <span style={{ font: "400 13px/1 var(--font-sans)", color: "rgba(10,10,10,.4)" }}>
                불러오는 중...
              </span>
            </div>
          )}
          <iframe
            src={formUrl}
            title={title}
            onLoad={() => setLoaded(true)}
            onError={() => setFailed(true)}
            style={{
              position: "absolute", inset: 0,
              width: "100%", height: "100%",
              border: "none",
              opacity: loaded ? 1 : 0,
              transition: "opacity .3s ease",
            }}
          />
        </>
      ) : (
        <div style={{
          position: "absolute", inset: 0,
          display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "center",
          gap: 24, padding: "40px 24px", textAlign: "center",
        }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 12, maxWidth: 440 }}>
            <p style={{ font: "700 22px/1.3 var(--font-sans)", color: "#0a0a0a", margin: 0 }}>{title}</p>
            <p style={{ font: "400 15px/1.6 var(--font-sans)", color: "rgba(10,10,10,.55)", margin: 0, whiteSpace: "pre-line" }}>{description}</p>
          </div>
          <a
            href={formUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "inline-flex", alignItems: "center", gap: 6,
              font: "500 15px/1 var(--font-sans)", color: "#fff",
              background: "#0a0a0a", padding: "14px 28px",
              borderRadius: "var(--r-full)", textDecoration: "none",
            }}
          >
            {fallbackLabel} ↗
          </a>
        </div>
      )}
    </div>
  );
}
