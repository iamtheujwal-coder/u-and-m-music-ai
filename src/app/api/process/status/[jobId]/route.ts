import { NextResponse } from "next/server";

// GET /api/process/status/[jobId] — Get processing job status
export async function GET(
  request: Request,
  { params }: { params: Promise<{ jobId: string }> }
) {
  const { jobId } = await params;
  
  // Mock: return a random progress
  const progress = Math.min(Math.floor(Math.random() * 100), 100);
  const stages = ["noise", "clarity", "pitch", "mix", "master", "export"];
  const currentStage = stages[Math.floor(progress / (100 / stages.length))];

  return NextResponse.json({
    job: {
      id: jobId,
      status: progress >= 100 ? "completed" : "processing",
      progress,
      current_stage: currentStage,
      logs: [
        { stage: "init", message: "Job started", timestamp: new Date().toISOString() },
        { stage: currentStage, message: `Processing: ${currentStage}`, timestamp: new Date().toISOString() },
      ],
    },
  });
}
