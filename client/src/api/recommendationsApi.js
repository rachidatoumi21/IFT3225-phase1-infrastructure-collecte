import { request } from "./apiClient";

export async function getQuietPlaceRecommendation() {
  return request("/recommendations/quiet-place");
}