const {
  clearCache,
  getCacheValue,
  setCacheValue
} = require("../services/cacheService");

function buildCacheKey(req) {
  return `${req.method}:${req.originalUrl}`;
}

function cachePublicResponse(ttlMs) {
  return function cacheMiddleware(req, res, next) {
    if (req.method !== "GET") {
      return next();
    }

    const cacheKey = buildCacheKey(req);
    const cachedResponse = getCacheValue(cacheKey);

    if (cachedResponse) {
      res.set("X-Cache", "HIT");
      res.set("Cache-Control", `public, max-age=${Math.floor(ttlMs / 1000)}`);
      return res.status(cachedResponse.statusCode).json(cachedResponse.body);
    }

    const originalJson = res.json.bind(res);

    res.json = function jsonWithCache(body) {
      if (res.statusCode >= 200 && res.statusCode < 300) {
        setCacheValue(
          cacheKey,
          {
            statusCode: res.statusCode,
            body
          },
          ttlMs
        );

        res.set("X-Cache", "MISS");
        res.set("Cache-Control", `public, max-age=${Math.floor(ttlMs / 1000)}`);
      }

      return originalJson(body);
    };

    return next();
  };
}

function invalidatePublicCacheOnWrite(req, res, next) {
  const writeMethods = ["POST", "PUT", "PATCH", "DELETE"];

  if (!writeMethods.includes(req.method)) {
    return next();
  }

  res.on("finish", () => {
    if (res.statusCode >= 200 && res.statusCode < 400) {
      clearCache();
    }
  });

  return next();
}

function noStorePrivateResponse(req, res, next) {
  res.set("Cache-Control", "no-store");
  return next();
}

module.exports = {
  cachePublicResponse,
  invalidatePublicCacheOnWrite,
  noStorePrivateResponse
};