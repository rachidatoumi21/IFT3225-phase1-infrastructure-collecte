const frontendCacheStore = new Map();

export const FRONTEND_CACHE_TTL = {
  locations: 60 * 1000,
  recommendation: 60 * 1000,
  ambiance: 5 * 60 * 1000
};

function logCacheStatus(status, key) {
  if (import.meta.env.DEV) {
    console.info(`[frontend-cache] ${status}: ${key}`);
  }
}

export function setFrontendCacheValue(key, value, ttlMs) {
  const expiresAt = Date.now() + ttlMs;

  frontendCacheStore.set(key, {
    value,
    expiresAt
  });
}

export function getFrontendCacheValue(key) {
  const entry = frontendCacheStore.get(key);

  if (!entry) {
    logCacheStatus("MISS", key);
    return null;
  }

  if (Date.now() > entry.expiresAt) {
    frontendCacheStore.delete(key);
    logCacheStatus("EXPIRED", key);
    return null;
  }

  logCacheStatus("HIT", key);
  return entry.value;
}

export async function cachedRequest(key, ttlMs, requestFunction) {
  const cachedValue = getFrontendCacheValue(key);

  if (cachedValue) {
    return cachedValue;
  }

  const freshValue = await requestFunction();

  setFrontendCacheValue(key, freshValue, ttlMs);

  return freshValue;
}

export function clearFrontendCache() {
  frontendCacheStore.clear();

  if (import.meta.env.DEV) {
    console.info("[frontend-cache] CLEARED");
  }
}

export function getFrontendCacheSize() {
  return frontendCacheStore.size;
}