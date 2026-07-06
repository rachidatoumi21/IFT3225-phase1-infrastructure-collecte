import { request } from "./apiClient";

export async function getLocations() {
  return request("/locations");
}

export async function getLocation(slug) {
  return request(`/locations/${slug}`);
}