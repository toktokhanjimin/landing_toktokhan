"use client";

import { useEffect } from "react";
import { recordWorkClick } from "../lib/store";

/** work 상세 진입 시 클릭 수 기록 (localStorage) */
export default function WorkDetailClient({ workId }: { workId: string }) {
  useEffect(() => {
    recordWorkClick(workId);
  }, [workId]);
  return null;
}
