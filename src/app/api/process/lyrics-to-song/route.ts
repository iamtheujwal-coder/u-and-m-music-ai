import { NextResponse } from "next/server";
import { audioQueue } from "@/lib/queue/audioQueue";

// Fallback to local map if Supabase fails (just like in projects/route.ts)
import { demoProjects } from "@/app/api/projects/route";

function generateId(): string {
  return `proj-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // 1. Create a "processing" project in the database
    // For this mock, we'll just push to demoProjects as we aren't enforcing Supabase Auth locally for MVP demo yet.
    const project = {
      id: generateId(),
      user_id: "demo-user",
      title: body.title || "AI Generated Song",
      mode: "lyrics",
      genre: body.genre || "Pop",
      mood: body.mood || "Happy",
      mastering_style: body.mastering_style || "clean",
      vocal_file_url: null,
      instrumental_file_url: null,
      output_file_url: null,
      status: "processing",
      created_at: new Date().toISOString(),
      prompt: body.prompt || "",
      lyrics: body.lyrics || "",
      language: body.language || "English",
      bpm: body.bpm || 120,
      key: body.key || "C Major",
      duration: body.duration || 180,
    };

    demoProjects.set(project.id, project as any);

    // 2. Dispatch to BullMQ for background processing
    await audioQueue.add("lyrics_to_song", {
      jobId: `job-${Date.now()}`,
      projectId: project.id,
      userId: project.user_id,
      taskType: "lyrics_to_song",
      params: { ...body }
    });

    return NextResponse.json({ success: true, project }, { status: 202 });

  } catch (error: any) {
    console.error("[LyricsToSong API] Error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
