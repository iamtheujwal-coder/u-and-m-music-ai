import { NextResponse } from "next/server";

// ============================================================
// Demo-mode storage for server-side API routes
// (localStorage isn't available in API routes, so we use a Map)
// ============================================================

interface ServerProject {
  id: string;
  user_id: string;
  title: string;
  mode: string;
  genre: string;
  mood: string;
  mastering_style: string;
  vocal_file_url: string | null;
  instrumental_file_url: string | null;
  output_file_url: string | null;
  output_wav_url?: string | null;
  output_flac_url?: string | null;
  acapella_url?: string | null;
  stems_zip_url?: string | null;
  lyrics_txt_url?: string | null;
  project_zip_url?: string | null;
  status: string;
  created_at: string;
  prompt?: string;
  lyrics?: string;
  language?: string;
  bpm?: number;
  key?: string;
  duration?: number;
  customization?: Record<string, unknown>;
}

// In-memory store for demo mode
const demoProjects = new Map<string, ServerProject>();

function generateId(): string {
  return `proj-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

function isDemoMode(): boolean {
  return !process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL === "";
}

// GET /api/projects — List all projects
export async function GET() {
  if (isDemoMode()) {
    const projects = Array.from(demoProjects.values()).sort(
      (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
    return NextResponse.json({ projects });
  }

  try {
    const { createClient } = await import("@/lib/supabase/server");
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
  } catch {
    // Supabase not available — return empty
    const projects = Array.from(demoProjects.values()).sort(
      (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
    return NextResponse.json({ projects });
  }
}

// POST /api/projects — Create a new project
export async function POST(request: Request) {
  const body = await request.json();

  if (isDemoMode()) {
    const project: ServerProject = {
      id: generateId(),
      user_id: "demo-user-001",
      title: body.title || "Untitled Project",
      mode: body.mode || "home_studio",
      genre: body.genre || "Pop",
      mood: body.mood || "Happy",
      mastering_style: body.mastering_style || "clean",
      vocal_file_url: body.vocal_file_url || null,
      instrumental_file_url: null,
      output_file_url: null,
      status: "processing",
      created_at: new Date().toISOString(),
      prompt: body.prompt || "",
      lyrics: body.lyrics || "",
      language: body.language || "English",
      bpm: body.bpm || 120,
      key: body.key || "C Major",
      duration: body.duration || 20,
      customization: body.customization || {},
    };
    demoProjects.set(project.id, project);
    return NextResponse.json({ project }, { status: 201 });
  }

  try {
    const { createClient } = await import("@/lib/supabase/server");
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

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
          status: body.status || "processing",
          prompt: body.prompt || "",
          lyrics: body.lyrics || "",
          language: body.language || "English",
          bpm: body.bpm || 120,
          key: body.key || "C Major",
          duration: body.duration || 20,
          customization: body.customization || {},
        },
      ])
      .select()
      .single();

    if (error) {
      console.error("PROJECT INSERT ERROR:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ project }, { status: 201 });
  } catch {
    // Fallback to demo mode
    const project: ServerProject = {
      id: generateId(),
      user_id: "demo-user-001",
      title: body.title || "Untitled Project",
      mode: body.mode || "home_studio",
      genre: body.genre || "Pop",
      mood: body.mood || "Happy",
      mastering_style: body.mastering_style || "clean",
      vocal_file_url: body.vocal_file_url || null,
      instrumental_file_url: null,
      output_file_url: null,
      status: "processing",
      created_at: new Date().toISOString(),
      prompt: body.prompt || "",
      lyrics: body.lyrics || "",
      bpm: body.bpm || 120,
      key: body.key || "C Major",
      duration: body.duration || 20,
      customization: body.customization || {},
    };
    demoProjects.set(project.id, project);
    return NextResponse.json({ project }, { status: 201 });
  }
}

// Export for use by other routes
export { demoProjects };
