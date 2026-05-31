import { NextResponse } from "next/server";
import { generateId } from "@/lib/utils";

// POST /api/process — Start a processing job
export async function POST(request: Request) {
  const body = await request.json();
  
  const job = {
    id: generateId(),
    project_id: body.project_id,
    type: body.type || "full_pipeline",
    status: "processing",
    progress: 0,
    logs: [
      { stage: "init", message: "Processing job created", timestamp: new Date().toISOString() },
      { stage: "noise", message: "Starting noise removal", timestamp: new Date().toISOString() },
    ],
    estimated_time: "2-5 minutes",
    created_at: new Date().toISOString(),
  };

  return NextResponse.json({ job }, { status: 201 });
}
