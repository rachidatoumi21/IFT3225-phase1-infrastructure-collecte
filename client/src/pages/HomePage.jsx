import { useLocations } from "../hooks/useLocations";
import AmbianceMap from "../components/map/AmbianceMap";
import LocationSummaryCard from "../components/ambiance/LocationSummaryCard";
import LoadingState from "../components/common/LoadingState";
import ErrorState from "../components/common/ErrorState";
import EmptyState from "../components/common/EmptyState";
import QuietPlaceRecommendation from "../components/recommendations/QuietPlaceRecommendation";

function HomePage() {
  const { locations, loading, errorMessage } = useLocations();

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
          <p className="eyebrow">IFT3225 · Phase 3</p>
          <h2>Portrait public de l’ambiance des lieux</h2>
          <p>
            Cette interface consomme l’API afin de rendre les données
            d’ambiance lisibles et actionnables pour un usager.
          </p>
        </div>
      </section>

      <QuietPlaceRecommendation />

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