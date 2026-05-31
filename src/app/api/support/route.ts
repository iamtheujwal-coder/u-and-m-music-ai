import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// GET /api/support — List user's support tickets
export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data: tickets, error } = await supabase
    .from("support_tickets")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ tickets });
}

// POST /api/support — Create support ticket
export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();

  if (!body.category || !body.subject || !body.message) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const { data: ticket, error } = await supabase
    .from("support_tickets")
    .insert([
      {
        user_id: user.id,
        category: body.category,
        subject: body.subject,
        message: body.message,
        status: "open",
      }
    ])
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ticket }, { status: 201 });
}
