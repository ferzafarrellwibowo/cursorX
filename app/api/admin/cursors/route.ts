import { NextResponse } from "next/server";
// @ts-ignore
import { supabaseAdmin as admin } from "@/app/utils/supabaseServer";
// @ts-ignore
const supabaseAdmin: any = admin;

export async function POST(request: Request) {
  try {
    const cursor = await request.json();

    const { data, error } = await supabaseAdmin
      .from("cursors")
      .insert([cursor])
      .select()
      .single();

    if (error) {
      console.error("Supabase Admin Insert Error:", error);
      return NextResponse.json({ success: false, error: error.message }, { status: 400 });
    }

    return NextResponse.json({ success: true, data });
  } catch (err: any) {
    console.error("Outer Error POST:", err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ success: false, error: "Missing ID" }, { status: 400 });
    }

    const { error } = await supabaseAdmin
      .from("cursors")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Supabase Admin Delete Error:", error);
      return NextResponse.json({ success: false, error: error.message }, { status: 400 });
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
