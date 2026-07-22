import { Link } from "react-router-dom";
import AmbianceBadge from "./AmbianceBadge";
import { formatDateTime, formatNumber } from "../../utils/formatDate";

function LocationSummaryCard({ location }) {
  const ambiance = location.currentAmbiance;
  const classification = ambiance?.classification;
  const freshness = ambiance?.freshness;

  const hasRecentMeasurement = freshness?.isRecent === true;

  return (
    <article className="location-card">
      <div className="location-card-header">
        <div>
          <h3>{location.name}</h3>
          <p className="location-address">{location.address}</p>
        </div>

        <AmbianceBadge classification={classification} />
      </div>

      <p className="location-description">{location.description}</p>

      <div className="location-stats">
        <div>
          <span className="stat-label">Moyenne récente</span>
          <strong>{formatNumber(ambiance?.averageDb)} dB</strong>
        </div>

        <div>
          <span className="stat-label">Mesure récente</span>
          <strong>{hasRecentMeasurement ? "Oui" : "Non"}</strong>
        </div>

        <div>
          <span className="stat-label">Dernière mesure</span>
          <strong>{formatDateTime(freshness?.latestMeasurementAt)}</strong>
        </div>
      </div>

      {!hasRecentMeasurement && (
        <p className="stale-warning">
          Aucune mesure récente selon le seuil de{" "}
          {freshness?.thresholdMinutes || 30} minutes. Le lieu reste affiché sur
          la carte avec l’état « données anciennes ».
        </p>
      )}

      <Link className="primary-link" to={`/lieux/${location.slug}`}>
        Voir le portrait d’ambiance
      </Link>
    </article>
  );
}

export default LocationSummaryCard;