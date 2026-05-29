import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "../../../../lib/supabase";
import { verifyAdminSession } from "../../_auth";

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!verifyAdminSession(req))
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const body = await req.json();
  const db = createAdminClient();

  const { data, error } = await db
    .from("work")
    .update(body)
    .eq("id", id)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!verifyAdminSession(req))
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const db = createAdminClient();

  // 연결된 Storage 이미지 삭제 (썸네일 + 섹션)
  const { data: work } = await db
    .from("work")
    .select("thumb_img, sections")
    .eq("id", id)
    .single();

  if (work) {
    const urls: string[] = [];
    if (work.thumb_img) urls.push(work.thumb_img);
    for (const sec of work.sections ?? []) {
      if (sec.img) urls.push(sec.img);
    }
    const paths = urls
      .map((u: string) => {
        try { return new URL(u).pathname.split("/work-images/")[1]; } catch { return null; }
      })
      .filter(Boolean) as string[];
    if (paths.length) await db.storage.from("work-images").remove(paths);
  }

  const { error } = await db.from("work").delete().eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
