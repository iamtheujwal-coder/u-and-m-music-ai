import Redis from "ioredis";

// Centralized Redis connection instance
const redisUrl = process.env.REDIS_URL || "redis://localhost:6379";

export const redisConnection = new Redis(redisUrl, {
  maxRetriesPerRequest: null,
});

redisConnection.on("error", (error) => {
  console.error("[Redis] Connection error:", error);
});

redisConnection.on("connect", () => {
  console.log("[Redis] Connected to server successfully");
});
