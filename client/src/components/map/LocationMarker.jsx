import L from "leaflet";
import { Marker, Popup } from "react-leaflet";
import { Link } from "react-router-dom";
import AmbianceBadge from "../ambiance/AmbianceBadge";
import { getAmbianceMeta } from "../../utils/ambianceLabels";
import { formatDateTime } from "../../utils/formatDate";

function LocationMarker({ location }) {
  const ambiance = location.currentAmbiance;
  const classification = ambiance?.classification;
  const freshness = ambiance?.freshness;
  const meta = getAmbianceMeta(classification);

  const hasRecentMeasurement = freshness?.isRecent === true;

  const icon = L.divIcon({
    className: "",
    html: `
      <div class="map-marker ${meta.className} ${
        hasRecentMeasurement ? "" : "marker-stale"
      }">
        ${meta.label}
      </div>
    `,
    iconSize: [100, 36],
    iconAnchor: [50, 18]
  });

  return (
    <Marker position={[location.latitude, location.longitude]} icon={icon}>
      <Popup>
        <div className="popup-content">
          <h3>{location.name}</h3>

          <AmbianceBadge classification={classification} />

          <p>{location.description}</p>

          <p>
            <strong>Dernière mesure :</strong>{" "}
            {formatDateTime(freshness?.latestMeasurementAt)}
          </p>

          <p>
            <strong>Mesure récente :</strong>{" "}
            {hasRecentMeasurement ? "Oui" : "Non"}
          </p>

          {!hasRecentMeasurement && (
            <p className="stale-warning">
              Données anciennes : aucune mesure récente selon le seuil de{" "}
              {freshness?.thresholdMinutes || 30} minutes.
            </p>
          )}

          <Link className="popup-link" to={`/lieux/${location.slug}`}>
            Ouvrir le portrait d’ambiance
          </Link>
        </div>
      </Popup>
    </Marker>
  );
}

export default LocationMarker;