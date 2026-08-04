const cacheStore = new Map();

function setCacheValue(key, value, ttlMs) {
  const expiresAt = Date.now() + ttlMs;

  cacheStore.set(key, {
    value,
    expiresAt
  });
}

function getCacheValue(key) {
  const entry = cacheStore.get(key);

  if (!entry) {
    return null;
  }

  if (Date.now() > entry.expiresAt) {
    cacheStore.delete(key);
    return null;
  }

  return entry.value;
}

function deleteCacheValue(key) {
  cacheStore.delete(key);
}

function clearCache() {
  cacheStore.clear();
}

function getCacheSize() {
  return cacheStore.size;
}

module.exports = {
  setCacheValue,
  getCacheValue,
  deleteCacheValue,
  clearCache,
  getCacheSize
};