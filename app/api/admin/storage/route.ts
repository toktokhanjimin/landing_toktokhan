import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "../../../lib/supabase";
import { verifyAdminSession } from "../_auth";

export async function POST(req: NextRequest) {
  if (!verifyAdminSession(req))
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const formData = await req.formData();
  const file = formData.get("file") as File | null;
  const bucket = (formData.get("bucket") as string) || "work-images";

  if (!file) return NextResponse.json({ error: "No file" }, { status: 400 });

  const ext = file.name.split(".").pop() ?? "jpg";
  const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

  const db = createAdminClient();
  const { error } = await db.storage
    .from(bucket)
    .upload(path, file, { contentType: file.type, upsert: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const { data: urlData } = db.storage.from(bucket).getPublicUrl(path);
  return NextResponse.json({ url: urlData.publicUrl });
}

export async function DELETE(req: NextRequest) {
  if (!verifyAdminSession(req))
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { url, bucket } = await req.json();
  if (!url || !bucket) return NextResponse.json({ error: "Missing params" }, { status: 400 });

  try {
    const path = new URL(url).pathname.split(`/${bucket}/`)[1];
    if (!path) return NextResponse.json({ error: "Invalid URL" }, { status: 400 });

    const db = createAdminClient();
    const { error } = await db.storage.from(bucket).remove([path]);
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Invalid URL" }, { status: 400 });
  }
}
