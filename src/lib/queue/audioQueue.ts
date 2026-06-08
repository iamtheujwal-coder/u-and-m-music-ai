import { Queue } from "bullmq";
import { redisConnection } from "./redis";

export const AUDIO_QUEUE_NAME = "uanm-audio-processing";

// The queue instance used by Next.js API routes to add jobs
export const audioQueue = new Queue(AUDIO_QUEUE_NAME, {
  connection: redisConnection as any,
  defaultJobOptions: {
    attempts: 3,
    backoff: {
      type: "exponential",
      delay: 5000,
    },
    removeOnComplete: 100,
    removeOnFail: 1000,
  },
});
