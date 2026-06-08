import { NextResponse } from "next/server";
import { demoProjects } from "../route";

function isDemoMode(): boolean {
  return !process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL === "";
}

// GET /api/projects/[id] — Get project by ID
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  if (isDemoMode()) {
    const project = demoProjects.get(id);
    if (!project) return NextResponse.json({ error: "Project not found" }, { status: 404 });
    return NextResponse.json({ project });
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
      .select("*")
      .eq("id", id)
      .eq("user_id", user.id)
      .single();

    if (error || !project) {
      return NextResponse.json({ error: error?.message || "Project not found" }, { status: 404 });
    }

    return NextResponse.json({ project });
  } catch {
    // Fallback
    const project = demoProjects.get(id);
    if (!project) return NextResponse.json({ error: "Project not found" }, { status: 404 });
    return NextResponse.json({ project });
  }
}

// PATCH /api/projects/[id] — Update project status / details
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await request.json();

  if (isDemoMode()) {
    const project = demoProjects.get(id);
    if (!project) return NextResponse.json({ error: "Project not found" }, { status: 404 });
    
    Object.assign(project, body);
    demoProjects.set(id, project);
    return NextResponse.json({ project });
  }

  try {
    const { createClient } = await import("@/lib/supabase/server");
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data: existingProject } = await supabase
      .from("projects")
      .select("*")
      .eq("id", id)
      .eq("user_id", user.id)
      .single();

    const updates: any = {};
    if (body.status) updates.status = body.status;
    if (body.output_file_url) updates.output_file_url = body.output_file_url;
    if (body.mastering_style) updates.mastering_style = body.mastering_style;

    if (body.status === "completed" && existingProject) {
      const { getAIProvider } = await import("@/lib/ai/modelRouter");
      const provider = getAIProvider();
      const routerResult = await provider.generateSong(
        {
          projectId: id,
          userId: user.id,
          genre: existingProject.genre,
          mood: existingProject.mood,
          prompt: existingProject.prompt,
          lyrics: existingProject.lyrics,
          masteringStyle: body.mastering_style || existingProject.mastering_style || "clean",
          vocalFileUrl: existingProject.vocal_file_url,
          bpm: existingProject.bpm,
          key: existingProject.key,
        }
      );

      if (routerResult.success && routerResult.details) {
        updates.output_mp3_url = routerResult.details.outputMp3Url;
        updates.output_wav_url = routerResult.details.outputWavUrl;
        updates.output_flac_url = routerResult.details.outputFlacUrl;
        updates.instrumental_url = routerResult.details.instrumentalUrl;
        updates.acapella_url = routerResult.details.acapellaUrl;
        updates.stems_zip_url = routerResult.details.stemsZipUrl;
        updates.lyrics_txt_url = routerResult.details.lyricsTxtUrl;
        updates.project_zip_url = routerResult.details.projectZipUrl;
        updates.quality_score = routerResult.metrics?.qualityScore || 85.0;
        updates.release_quality_score = routerResult.metrics?.releaseQualityScore || 90.0;
        updates.producer_notes = routerResult.details.producerNotes || {};
        
        updates.bpm = routerResult.details.bpm || existingProject.bpm || 120;
        updates.key = routerResult.details.key || existingProject.key || "C Major";
        updates.duration = routerResult.details.duration || existingProject.duration || 180;
        
        updates.output_file_url = routerResult.details.outputMp3Url || routerResult.outputUrl;
      }
    }

    const { data: project, error } = await supabase
      .from("projects")
      .update(updates)
      .eq("id", id)
      .eq("user_id", user.id)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ project });
  } catch (err: any) {
    // Fallback
    const project = demoProjects.get(id);
    if (!project) return NextResponse.json({ error: "Project not found" }, { status: 404 });
    Object.assign(project, body);
    demoProjects.set(id, project);
    return NextResponse.json({ project });
  }
}

// DELETE /api/projects/[id] — Delete project
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  if (isDemoMode()) {
    if (demoProjects.has(id)) {
      demoProjects.delete(id);
      return NextResponse.json({ message: `Project ${id} deleted` });
    }
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  try {
    const { createClient } = await import("@/lib/supabase/server");
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { error } = await supabase
      .from("projects")
      .delete()
      .eq("id", id)
      .eq("user_id", user.id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ message: `Project ${id} deleted` });
  } catch {
    if (demoProjects.has(id)) {
      demoProjects.delete(id);
      return NextResponse.json({ message: `Project ${id} deleted` });
    }
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
}
