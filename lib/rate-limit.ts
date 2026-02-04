type RateLimitOptions = {
    limit: number;
    windowMs: number;
};

const trackers = new Map<string, { count: number; expiresAt: number }>();

export function isRateLimited(key: string, options: RateLimitOptions): boolean {
    const now = Date.now();
    const record = trackers.get(key);

    if (!record) {
        trackers.set(key, {
            count: 1,
            expiresAt: now + options.windowMs,
        });
        return false;
    }

    if (now > record.expiresAt) {
        trackers.set(key, {
            count: 1,
            expiresAt: now + options.windowMs,
        });
        return false;
    }

    record.count++;

    return record.count > options.limit;
}
