import { request } from "./apiClient";
import { cachedRequest, FRONTEND_CACHE_TTL } from "./frontendCache";

export async function getAmbianceSummary(slug) {
  return cachedRequest(
    `ambiance:summary:${slug}`,
    FRONTEND_CACHE_TTL.ambiance,
    () => request(`/ambiance/${slug}/summary`)
  );
}

export async function getAmbianceHistory(slug, last = "3h") {
  return cachedRequest(
    `ambiance:history:${slug}:${last}`,
    FRONTEND_CACHE_TTL.ambiance,
    () => request(`/ambiance/${slug}/history?last=${last}`)
  );
}

export async function getQuietHours(slug) {
  return cachedRequest(
    `ambiance:quiet-hours:${slug}`,
    FRONTEND_CACHE_TTL.ambiance,
    () => request(`/ambiance/${slug}/quiet-hours`)
  );
}