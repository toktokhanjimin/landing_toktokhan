"use client";

import { useEffect } from "react";

/** 특정 페이지에서 body 배경을 흰색으로 강제 설정하는 클라이언트 전용 컴포넌트 */
export default function WhiteBackground() {
  useEffect(() => {
    const prev = document.body.style.background;
    document.body.style.background = "#ffffff";
    return () => { document.body.style.background = prev; };
  }, []);
  return null;
}
