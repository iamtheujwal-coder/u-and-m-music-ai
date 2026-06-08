import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// GET /api/projects — List all projects
export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data: projects, error } = await supabase
    .from("projects")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ projects });
}

// POST /api/projects — Create a new project
export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { data: project, error } = await supabase
    .from("projects")
    .insert([
      {
        user_id: user.id,
        title: body.title || "Untitled Project",
        mode: body.mode || "home_studio",
        genre: body.genre || "",
        mood: body.mood || "",
        mastering_style: body.mastering_style || "clean",
        vocal_file_url: body.vocal_file_url || null,
        status: body.vocal_file_url ? "processing" : "draft",
      }
    ])
    .select()
    .single();

  if (error) {
    console.error("PROJECT INSERT ERROR:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ project }, { status: 201 });
}
