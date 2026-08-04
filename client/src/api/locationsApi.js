import { request } from "./apiClient";
import { cachedRequest, FRONTEND_CACHE_TTL } from "./frontendCache";

export async function getLocations() {
  return cachedRequest("locations:list", FRONTEND_CACHE_TTL.locations, () =>
    request("/locations")
  );
}

export async function getLocation(slug) {
  return cachedRequest(
    `locations:detail:${slug}`,
    FRONTEND_CACHE_TTL.locations,
    () => request(`/locations/${slug}`)
  );
}