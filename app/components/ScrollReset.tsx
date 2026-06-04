"use client";

import { useEffect } from "react";

/** 새로고침 시 스크롤 위치를 항상 맨 위로 리셋 */
export default function ScrollReset() {
  useEffect(() => {
    // 브라우저의 스크롤 위치 자동 복원 비활성화
    if ("scrollRestoration" in history) {
      history.scrollRestoration = "manual";
    }
    window.scrollTo(0, 0);
  }, []);

  return null;
}
