import { useCallback, useEffect, useState } from "react";
import { getLocations } from "../api/locationsApi";

export function useLocations() {
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  const loadLocations = useCallback(async () => {
    try {
      setLoading(true);
      setErrorMessage("");

      const response = await getLocations();
      setLocations(response.data || []);
    } catch (error) {
      setErrorMessage(error.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadLocations();
  }, [loadLocations]);

  return {
    locations,
    loading,
    errorMessage,
    reloadLocations: loadLocations
  };
}