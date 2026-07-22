import { request } from "./apiClient";

function getAuthHeaders(token) {
  return {
    Authorization: `Bearer ${token}`
  };
}

export async function getMyObservations(token) {
  return request("/account/observations", {
    headers: getAuthHeaders(token)
  });
}

export async function getMyPlaces(token) {
  return request("/account/places", {
    headers: getAuthHeaders(token)
  });
}

export async function getMyFavorites(token) {
  return request("/account/favorites", {
    headers: getAuthHeaders(token)
  });
}

export async function addFavoriteLocation(slug, token) {
  return request(`/account/favorites/${slug}`, {
    method: "POST",
    headers: getAuthHeaders(token)
  });
}

export async function removeFavoriteLocation(slug, token) {
  return request(`/account/favorites/${slug}`, {
    method: "DELETE",
    headers: getAuthHeaders(token)
  });
}