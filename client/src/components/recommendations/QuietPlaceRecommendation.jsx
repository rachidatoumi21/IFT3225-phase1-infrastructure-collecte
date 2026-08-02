import { Link } from "react-router-dom";
import { useQuietPlaceRecommendation } from "../../hooks/useQuietPlaceRecommendation";
import AmbianceBadge from "../ambiance/AmbianceBadge";
import { formatNumber } from "../../utils/formatDate";

function QuietPlaceRecommendation() {
  const { recommendation, message, loading, errorMessage } =
    useQuietPlaceRecommendation();

  if (loading) {
    return (
      <section className="recommendation-card">
        <p className="eyebrow">Recommandation</p>
        <h2>Recherche du meilleur lieu calme...</h2>
      </section>
    );
  }

  if (errorMessage) {
    return (
      <section className="recommendation-card">
        <p className="eyebrow">Recommandation</p>
        <h2>Recommandation indisponible</h2>
        <p>{errorMessage}</p>
      </section>
    );
  }

  if (!recommendation) {
    return (
      <section className="recommendation-card">
        <p className="eyebrow">Recommandation</p>
        <h2>Aucun lieu calme recommandé pour le moment</h2>
        <p>
          {message ||
            "Aucune mesure récente ne permet actuellement de recommander un lieu."}
        </p>
      </section>
    );
  }

  return (
    <section className="recommendation-card">
      <div>
        <p className="eyebrow">Recommandation</p>
        <h2>Meilleur lieu calme maintenant</h2>
        <h3>{recommendation.name}</h3>
        <p>{recommendation.address}</p>
        <p>{recommendation.reason}</p>

        <p>
          Moyenne récente :{" "}
          <strong>{formatNumber(recommendation.averageDb)} dB</strong>
        </p>
      </div>

      <div className="recommendation-actions">
        <AmbianceBadge classification={recommendation.classification} />

        <Link className="primary-link" to={`/lieux/${recommendation.slug}`}>
          Voir le portrait
        </Link>
      </div>
    </section>
  );
}

export default QuietPlaceRecommendation;