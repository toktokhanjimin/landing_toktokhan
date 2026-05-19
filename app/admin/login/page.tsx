"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? "로그인에 실패했어요.");
        return;
      }

      router.push("/admin");
      router.refresh();
    } catch {
      setError("네트워크 오류가 발생했어요.");
    } finally {
      setLoading(false);
    }
  }

  const inputStyle = {
    width: "100%",
    padding: "12px 14px",
    border: "1px solid rgba(10,10,10,.14)",
    borderRadius: 10,
    font: "400 15px/1.5 var(--font-sans, sans-serif)",
    color: "#0a0a0a",
    background: "#fff",
    outline: "none",
    boxSizing: "border-box" as const,
    transition: "border-color .2s",
  };

  return (
    <div style={{
      minHeight: "100dvh",
      background: "#f5f5f5",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: 24,
      fontFamily: "var(--font-sans, sans-serif)",
    }}>
      <div style={{
        background: "#fff",
        border: "1px solid rgba(10,10,10,.08)",
        borderRadius: 16,
        padding: "48px 40px",
        width: "100%",
        maxWidth: 400,
        boxShadow: "0 4px 24px rgba(0,0,0,.06)",
      }}>
        {/* Logo */}
        <div style={{ marginBottom: 40 }}>
          <div style={{ font: "700 16px/1 var(--font-sans, sans-serif)", letterSpacing: ".1em", color: "#0a0a0a" }}>
            TOKTOKHAN
          </div>
          <div style={{ font: "400 12px/1 var(--font-sans, sans-serif)", color: "rgba(10,10,10,.4)", marginTop: 6, letterSpacing: ".04em" }}>
            Admin CMS
          </div>
        </div>

        <h1 style={{ font: "700 22px/1.2 var(--font-sans, sans-serif)", color: "#0a0a0a", margin: "0 0 28px", letterSpacing: "-.02em" }}>
          로그인
        </h1>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div>
            <label style={{ font: "500 12px/1 var(--font-sans, sans-serif)", color: "rgba(10,10,10,.5)", letterSpacing: ".04em", display: "block", marginBottom: 8 }}>
              아이디
            </label>
            <input
              style={inputStyle}
              type="text"
              value={id}
              onChange={(e) => setId(e.target.value)}
              placeholder="아이디 입력"
              autoComplete="username"
              required
            />
          </div>

          <div>
            <label style={{ font: "500 12px/1 var(--font-sans, sans-serif)", color: "rgba(10,10,10,.5)", letterSpacing: ".04em", display: "block", marginBottom: 8 }}>
              비밀번호
            </label>
            <input
              style={inputStyle}
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="비밀번호 입력"
              autoComplete="current-password"
              required
            />
          </div>

          {error && (
            <div style={{
              font: "400 13px/1.4 var(--font-sans, sans-serif)",
              color: "#e53e3e",
              background: "rgba(229,62,62,.06)",
              border: "1px solid rgba(229,62,62,.2)",
              borderRadius: 8,
              padding: "10px 14px",
            }}>
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              marginTop: 8,
              width: "100%",
              padding: "13px",
              background: loading ? "rgba(10,10,10,.4)" : "#0a0a0a",
              color: "#fff",
              border: "none",
              borderRadius: 10,
              font: "600 15px/1 var(--font-sans, sans-serif)",
              cursor: loading ? "default" : "pointer",
              transition: "background .2s",
            }}
          >
            {loading ? "로그인 중..." : "로그인"}
          </button>
        </form>
      </div>
    </div>
  );
}
