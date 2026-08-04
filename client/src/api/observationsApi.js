import { request } from "./apiClient";
import { clearFrontendCache } from "./frontendCache";

function getAuthHeaders(token) {
  return {
    Authorization: `Bearer ${token}`
  };
}

export async function createObservation(observation, token) {
  const response = await request("/observations", {
    method: "POST",
    headers: getAuthHeaders(token),
    body: JSON.stringify(observation)
  });

  clearFrontendCache();

  return response;
}