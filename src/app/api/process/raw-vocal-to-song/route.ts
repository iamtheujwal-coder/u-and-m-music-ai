import { NextResponse } from "next/server";
import { audioQueue } from "@/lib/queue/audioQueue";
import { demoProjects } from "@/app/api/projects/route";

function generateId(): string {
  return `proj-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    if (!body.vocal_file_url) {
      return NextResponse.json({ success: false, error: "vocal_file_url is required" }, { status: 400 });
    }

    const project = {
      id: generateId(),
      user_id: "demo-user",
      title: body.title || "Vocal Cover / Processing",
      mode: "raw_vocal",
      genre: body.genre || "Pop",
      mood: body.mood || "Happy",
      mastering_style: body.mastering_style || "clean",
      vocal_file_url: body.vocal_file_url,
      instrumental_file_url: null,
      output_file_url: null,
      status: "processing",
      created_at: new Date().toISOString(),
      prompt: body.prompt || "",
      lyrics: body.lyrics || "",
      bpm: body.bpm || 120,
      key: body.key || "C Major",
      duration: body.duration || 180,
    };

    demoProjects.set(project.id, project as any);

    // Dispatch to BullMQ
    await audioQueue.add("raw_vocal_to_song", {
      jobId: `job-${Date.now()}`,
      projectId: project.id,
      userId: project.user_id,
      taskType: "raw_vocal_to_song",
      params: { ...body }
    });

    return NextResponse.json({ success: true, project }, { status: 202 });

  } catch (error: any) {
    console.error("[RawVocal API] Error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
