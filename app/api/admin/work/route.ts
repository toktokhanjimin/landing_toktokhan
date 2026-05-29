import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "../../../lib/supabase";
import { verifyAdminSession } from "../_auth";

export async function GET(req: NextRequest) {
  if (!verifyAdminSession(req))
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const db = createAdminClient();
  const { data, error } = await db
    .from("work")
    .select("*")
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function POST(req: NextRequest) {
  if (!verifyAdminSession(req))
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const db = createAdminClient();

  // 새 항목이 맨 앞에 오도록 현재 최솟값보다 1 낮은 sort_order 할당
  const { data: min } = await db
    .from("work")
    .select("sort_order")
    .order("sort_order", { ascending: true })
    .limit(1)
    .single();

  const sortOrder = (min?.sort_order ?? 1) - 1;

  const { data, error } = await db
    .from("work")
    .insert({ ...body, sort_order: sortOrder })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data, { status: 201 });
}
