import { useEffect, useState } from "react";
import { getLocations } from "../api/locationsApi";
import AmbianceMap from "../components/map/AmbianceMap";
import LocationSummaryCard from "../components/ambiance/LocationSummaryCard";
import LoadingState from "../components/common/LoadingState";
import ErrorState from "../components/common/ErrorState";
import EmptyState from "../components/common/EmptyState";

function HomePage() {
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    async function loadLocations() {
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
    }

    loadLocations();
  }, []);

  if (loading) {
    return (
      <LoadingState message="Chargement des lieux et de leur ambiance..." />
    );
  }

  if (errorMessage) {
    return <ErrorState message={errorMessage} />;
  }

  if (locations.length === 0) {
    return (
      <EmptyState message="Aucun lieu n’est disponible pour le moment." />
    );
  }

  return (
    <div className="page">
      <section className="hero">
        <div>
          <p className="eyebrow">IFT3225 · Phase 2</p>
          <h2>Portrait public de l’ambiance des lieux</h2>
          <p>
            Cette interface consomme l’API de la phase 1 afin de rendre les
            données d’ambiance lisibles et actionnables pour un usager.
          </p>
        </div>
      </section>

      <AmbianceMap locations={locations} />

      <section className="locations-section">
        <div className="section-heading">
          <h2>Résumé des lieux</h2>
          <p>
            Les classifications affichées proviennent de l’API. Le client React
            affiche les résultats, sans recalculer l’ambiance côté interface.
          </p>
        </div>

        <div className="location-grid">
          {locations.map((location) => (
            <LocationSummaryCard key={location.slug} location={location} />
          ))}
        </div>
      </section>
    </div>
  );
}

export default HomePage;