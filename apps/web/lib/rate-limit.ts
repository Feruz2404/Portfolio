type RateLimitOptions = {
  key: string;
  limit: number;
  windowMs: number;
};

const buckets = new Map<string, { count: number; resetAt: number }>();

export function checkRateLimit({ key, limit, windowMs }: RateLimitOptions) {
  const now = Date.now();
  const bucket = buckets.get(key);

  if (!bucket || bucket.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return { allowed: true, remaining: limit - 1 };
  }

  if (bucket.count >= limit) {
    return { allowed: false, remaining: 0, retryAfter: Math.ceil((bucket.resetAt - now) / 1000) };
  }

  bucket.count += 1;
  return { allowed: true, remaining: Math.max(0, limit - bucket.count) };
}

export function getClientIp(req: Request) {
  return (
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    req.headers.get("x-real-ip") ??
    "unknown"
  );
}

// ── Failed-login lockout (counts failures only; success clears them) ─────────
const loginFailures = new Map<string, { count: number; resetAt: number }>();

export function isLoginLocked(key: string, max = 8) {
  const bucket = loginFailures.get(key);
  if (!bucket || bucket.resetAt <= Date.now()) return false;
  return bucket.count >= max;
}

export function recordLoginFailure(key: string, windowMs = 15 * 60 * 1000) {
  const now = Date.now();
  const bucket = loginFailures.get(key);
  if (!bucket || bucket.resetAt <= now) {
    loginFailures.set(key, { count: 1, resetAt: now + windowMs });
    return;
  }
  bucket.count += 1;
}

export function clearLoginFailures(key: string) {
  loginFailures.delete(key);
}
