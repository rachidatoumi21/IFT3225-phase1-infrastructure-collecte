import { request } from "./apiClient";

export async function getAmbianceSummary(slug) {
  return request(`/ambiance/${slug}/summary`);
}

export async function getAmbianceHistory(slug, last = "3h") {
  return request(`/ambiance/${slug}/history?last=${last}`);
}

export async function getQuietHours(slug) {
  return request(`/ambiance/${slug}/quiet-hours`);
}