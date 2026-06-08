import { NextResponse } from "next/server";
import { audioQueue } from "@/lib/queue/audioQueue";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    if (!body.consent_confirmed) {
      return NextResponse.json({ success: false, error: "Must confirm consent to train Voice DNA" }, { status: 400 });
    }

    if (!body.sample_urls || body.sample_urls.length === 0) {
      return NextResponse.json({ success: false, error: "Must provide audio samples" }, { status: 400 });
    }

    // Usually we would insert this into the Supabase "voice_models" table here.
    const voiceModelId = `voice-${Date.now()}`;

    // Dispatch to BullMQ worker
    await audioQueue.add("voice_training", {
      jobId: `job-${Date.now()}`,
      projectId: voiceModelId, // Using projectId as the model ID for the worker's reference
      userId: "demo-user",
      taskType: "voice_training",
      params: { ...body }
    });

    return NextResponse.json({ 
      success: true, 
      message: "Voice DNA training initiated", 
      modelId: voiceModelId 
    }, { status: 202 });

  } catch (error: any) {
    console.error("[VoiceTraining API] Error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
