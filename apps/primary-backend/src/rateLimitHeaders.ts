import type { RateLimitResult } from "./rateLimit";

export function setRateLimitHeaders(
    set: { headers: Record<string, string> },
    result: RateLimitResult
) {
    set.headers["X-RateLimit-Limit"] = String(result.limit);
    set.headers["X-RateLimit-Remaining"] = String(result.remaining);
    set.headers["X-RateLimit-Reset"] = String(result.reset);
}