
import { useEffect, useState } from "react";
import { getQuietPlaceRecommendation } from "../api/recommendationsApi";

export function useQuietPlaceRecommendation() {
  const [recommendation, setRecommendation] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    async function loadRecommendation() {
      try {
        setLoading(true);
        setErrorMessage("");

        const response = await getQuietPlaceRecommendation();

        setRecommendation(response.data || null);
        setMessage(response.message || "");
      } catch (error) {
        setErrorMessage(error.message);
      } finally {
        setLoading(false);
      }
    }

    loadRecommendation();
  }, []);

  return {
    recommendation,
    message,
    loading,
    errorMessage
  };
}