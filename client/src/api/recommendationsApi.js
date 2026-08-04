import { request } from "./apiClient";
import { cachedRequest, FRONTEND_CACHE_TTL } from "./frontendCache";

export async function getQuietPlaceRecommendation() {
  return cachedRequest(
    "recommendations:quiet-place",
    FRONTEND_CACHE_TTL.recommendation,
    () => request("/recommendations/quiet-place")
  );
}