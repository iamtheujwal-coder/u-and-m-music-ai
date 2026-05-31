import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// GET /api/voice-model — Get user's voice model
export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data: voiceModel, error } = await supabase
    .from("voice_models")
    .select("*")
    .eq("user_id", user.id)
    .single();

  if (error && error.code !== "PGRST116") { // PGRST116 is no rows returned
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ voice_model: voiceModel || null });
}

// POST /api/voice-model — Create voice model
export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  
  if (!body.consent_confirmed) {
    return NextResponse.json(
      { error: "Voice consent is required" },
      { status: 400 }
    );
  }

  const { data: model, error } = await supabase
    .from("voice_models")
    .insert([
      {
        user_id: user.id,
        name: body.name || "My Voice",
        status: "pending",
        consent_confirmed: true,
        sample_count: 0,
      }
    ])
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ voice_model: model }, { status: 201 });
}
