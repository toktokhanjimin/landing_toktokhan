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
    .from("insights")
    .update(body)
    .eq("id", Number(id))
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

  // 연결된 Storage 이미지 삭제
  const { data: insight } = await db
    .from("insights")
    .select("thumb_img")
    .eq("id", Number(id))
    .single();

  if (insight?.thumb_img?.startsWith("http")) {
    try {
      const path = new URL(insight.thumb_img).pathname.split("/insight-images/")[1];
      if (path) await db.storage.from("insight-images").remove([path]);
    } catch { /* URL 파싱 실패 무시 */ }
  }

  const { error } = await db.from("insights").delete().eq("id", Number(id));
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
