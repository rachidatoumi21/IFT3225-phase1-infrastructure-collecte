import { useCallback, useEffect, useState } from "react";
import {
  getMyFavorites,
  getMyObservations,
  getMyPlaces,
  removeFavoriteLocation
} from "../api/accountApi";

export function useAccountData({ isAuthenticated, token }) {
  const [observations, setObservations] = useState([]);
  const [places, setPlaces] = useState([]);
  const [favorites, setFavorites] = useState([]);

  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [actionMessage, setActionMessage] = useState("");

  const loadAccountData = useCallback(async () => {
    if (!isAuthenticated || !token) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setErrorMessage("");

      const [observationsResponse, placesResponse, favoritesResponse] =
        await Promise.all([
          getMyObservations(token),
          getMyPlaces(token),
          getMyFavorites(token)
        ]);

      setObservations(observationsResponse.data || []);
      setPlaces(placesResponse.data || []);
      setFavorites(favoritesResponse.data || []);
    } catch (error) {
      setErrorMessage(error.message);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, token]);

  useEffect(() => {
    loadAccountData();
  }, [loadAccountData]);

  async function removeFavorite(slug) {
    try {
      setActionMessage("");
      setErrorMessage("");

      await removeFavoriteLocation(slug, token);

      setFavorites((currentFavorites) =>
        currentFavorites.filter((favorite) => favorite.slug !== slug)
      );

      setActionMessage("Le lieu a été retiré de vos favoris.");
    } catch (error) {
      setErrorMessage(error.message);
    }
  }

  return {
    observations,
    places,
    favorites,
    loading,
    errorMessage,
    actionMessage,
    removeFavorite,
    reloadAccountData: loadAccountData
  };
}