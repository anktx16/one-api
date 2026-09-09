import { redis } from "./redis";

const rateLimitScript = `
    local count = redis.call("INCR", KEYS[1])

    if count == 1 then
        redis.call("EXPIRE", KEYS[1], ARGV[1])
    end

    local ttl = redis.call("TTL", KEYS[1])

    return {count, ttl}
`;

export type RateLimitResult = {
    allowed: boolean;
    limit: number;
    remaining: number;
    reset: number;
};

export async function checkRateLimit(
    key: string,
    limit: number,
    windowSeconds: number
): Promise<RateLimitResult> {

    const result = await redis.eval(
        rateLimitScript,
        1,
        key,
        windowSeconds
    ) as [number, number];

    const count = result[0];
    const ttl = result[1];

    return {
        allowed: count <= limit,
        limit,
        remaining: Math.max(0, limit - count),
        reset: ttl,
    };
}