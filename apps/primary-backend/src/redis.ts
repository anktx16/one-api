import Redis from "ioredis";

export const redis = new Redis(process.env.REDIS_URL!, {
    maxRetriesPerRequest: 3,
    enableReadyCheck: true,
});

redis.on("connect", () => {
    console.log("Primary Redis connecting...");
});

redis.on("ready", () => {
    console.log("Primary Redis ready!");
});

redis.on("error", (error) => {
    console.error("Primary Redis error:", error.message);
});

redis.on("close", () => {
    console.log("Primary Redis connection closed");
});

redis.on("reconnecting", (delay) => {
    console.log(`Primary Redis reconnecting in ${delay}ms`);
});