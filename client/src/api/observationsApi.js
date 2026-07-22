import { request } from "./apiClient";

function getAuthHeaders(token) {
  return {
    Authorization: `Bearer ${token}`
  };
}

export async function createObservation(observation, token) {
  return request("/observations", {
    method: "POST",
    headers: getAuthHeaders(token),
    body: JSON.stringify(observation)
  });
}