"use client";

import { use } from "react";
import InsightEditorPage from "../_EditorPage";

export default function EditInsightPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  return <InsightEditorPage mode="edit" id={id} />;
}
