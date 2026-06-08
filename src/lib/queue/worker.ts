import { Worker, Job } from "bullmq";
import { redisConnection } from "./redis";
import { AUDIO_QUEUE_NAME } from "./audioQueue";
import { getAIProvider } from "../ai/modelRouter";
// Note: In a real app, you would import a Supabase service role client to update the DB securely from the worker.
// import { createClient } from "@supabase/supabase-js";

interface ProcessingJobData {
  jobId: string;
  projectId: string;
  userId: string;
  taskType: string;
  params: any;
}

const aiProvider = getAIProvider();

// Mock database update function (since we aren't fully wired to Supabase here in the standalone worker yet)
async function updateJobStatus(jobId: string, status: string, progress: number, outputUrl?: string) {
  console.log(`[DB Mock] Job ${jobId} -> ${status} (${progress}%) ${outputUrl ? `| Output: ${outputUrl}` : ""}`);
}

const worker = new Worker<ProcessingJobData>(
  AUDIO_QUEUE_NAME,
  async (job: Job) => {
    const { jobId, projectId, taskType, params } = job.data;
    console.log(`[Worker] Started job ${job.id} for task ${taskType}`);

    try {
      await updateJobStatus(jobId, "processing", 10);

      // Report progress to BullMQ
      await job.updateProgress(10);

      let result;
      switch (taskType) {
        case "lyrics_to_song":
        case "raw_vocal_to_song":
          result = await aiProvider.generateSong(params);
          break;
        case "voice_training":
          result = await aiProvider.trainVoice(params);
          break;
        case "mix_master":
          result = await aiProvider.mixMaster(params);
          break;
        case "stem_separation":
          result = await aiProvider.separateStems(params);
          break;
        default:
          throw new Error(`Unknown taskType: ${taskType}`);
      }

      if (!result.success) {
        throw new Error("AI Provider returned failure");
      }

      await job.updateProgress(100);
      
      // The exact output property changes based on the interface (outputUrl, stemsZipUrl, modelUrl, etc.)
      const finalUrl = (result as any).outputUrl || (result as any).stemsZipUrl || (result as any).details?.modelUrl;

      await updateJobStatus(jobId, "completed", 100, finalUrl);
      
      console.log(`[Worker] Completed job ${job.id}`);
      return result;

    } catch (error: any) {
      console.error(`[Worker] Failed job ${job.id}:`, error);
      await updateJobStatus(jobId, "failed", 0);
      throw error;
    }
  },
  {
    connection: redisConnection as any,
    concurrency: 5, // Process up to 5 audio jobs concurrently
  }
);

worker.on("ready", () => {
  console.log(`[Worker] Listening on queue "${AUDIO_QUEUE_NAME}"`);
});

worker.on("failed", (job, err) => {
  console.error(`[Worker] Job ${job?.id} failed with error ${err.message}`);
});

// Graceful shutdown
process.on("SIGTERM", async () => {
  console.log("[Worker] Shutting down...");
  await worker.close();
  await redisConnection.quit();
  process.exit(0);
});
