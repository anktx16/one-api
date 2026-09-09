import { redis } from "./redis";

const RATE_LIMIT = 5;
const WINDOW_SECONDS = 60;

const rateLimitScript = `
  local count = redis.call("INCR", KEYS[1])

  if count == 1 then
    redis.call("EXPIRE", KEYS[1], ARGV[1])
  end

  local ttl = redis.call("TTL", KEYS[1])

  return {count, ttl}
`;

export async function checkRateLimit(apiKey: string) {
  const key = `rate_limit:${apiKey}`;

  const result = await redis.eval(
    rateLimitScript,
    1,
    key,
    WINDOW_SECONDS
  ) as [number, number];

  const count = result[0];
  const ttl = result[1];

  return {
    allowed: count <= RATE_LIMIT,
    limit: RATE_LIMIT,
    remaining: Math.max(0, RATE_LIMIT - count),
    reset: ttl,
  };
}