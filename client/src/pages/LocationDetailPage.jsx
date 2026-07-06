import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getLocations } from "../api/locationsApi";
import {
  getAmbianceHistory,
  getAmbianceSummary,
  getQuietHours
} from "../api/ambianceApi";
import AmbianceBadge from "../components/ambiance/AmbianceBadge";
import HistoryChart from "../components/ambiance/HistoryChart";
import QuietHoursList from "../components/ambiance/QuietHoursList";
import LoadingState from "../components/common/LoadingState";
import ErrorState from "../components/common/ErrorState";
import EmptyState from "../components/common/EmptyState";
import { formatDateTime, formatNumber } from "../utils/formatDate";

function LocationDetailPage() {
  const { slug } = useParams();

  const [location, setLocation] = useState(null);
  const [summary, setSummary] = useState(null);
  const [history, setHistory] = useState(null);
  const [quietHours, setQuietHours] = useState(null);

  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    async function loadLocationPortrait() {
      try {
        setLoading(true);
        setErrorMessage("");

        const locationsResponse = await getLocations();

        const foundLocation = (locationsResponse.data || []).find(
          (item) => item.slug === slug
        );

        if (!foundLocation) {
          setLocation(null);
          return;
        }

        setLocation(foundLocation);

        const summaryResult = await getAmbianceSummary(slug).catch(() => null);
        const historyResult = await getAmbianceHistory(slug, "3h").catch(
          () => null
        );
        const quietHoursResult = await getQuietHours(slug).catch(() => null);

        setSummary(summaryResult?.data || null);
        setHistory(historyResult?.data || null);
        setQuietHours(quietHoursResult?.data || null);
      } catch (error) {
        setErrorMessage(error.message);
      } finally {
        setLoading(false);
      }
    }

    loadLocationPortrait();
  }, [slug]);

  if (loading) {
    return <LoadingState message="Chargement du portrait d’ambiance..." />;
  }

  if (errorMessage) {
    return <ErrorState message={errorMessage} />;
  }

  if (!location) {
    return <EmptyState message="Ce lieu est introuvable." />;
  }

  const currentAmbiance = location.currentAmbiance;
  const classification = currentAmbiance?.classification;
  const freshness = currentAmbiance?.freshness;
  const hasRecentMeasurement = freshness?.isRecent === true;

  return (
    <div className="page">
      <Link className="back-link" to="/">
        ← Retour à la carte
      </Link>

      <section className="detail-hero">
        <div>
          <p className="eyebrow">Portrait d’ambiance</p>
          <h2>{location.name}</h2>
          <p className="location-address">{location.address}</p>
          <p>{location.description}</p>
        </div>

        <AmbianceBadge classification={classification} />
      </section>

      <section className="detail-grid">
        <article className="metric-card">
          <h3>Classification actuelle</h3>
          <AmbianceBadge classification={classification} />
          <p>{classification?.description}</p>
        </article>

        <article className="metric-card">
          <h3>Moyenne récente</h3>
          <strong>{formatNumber(currentAmbiance?.averageDb)} dB</strong>
          <p>
            Cette valeur provient de l’API. Le client React ne recalcule pas
            l’ambiance.
          </p>
        </article>

        <article className="metric-card">
          <h3>Fraîcheur des données</h3>
          <strong>{hasRecentMeasurement ? "Récente" : "Non récente"}</strong>
          <p>
            Dernière mesure : {formatDateTime(freshness?.latestMeasurementAt)}
          </p>
          <p>Seuil retenu : {freshness?.thresholdMinutes || 30} minutes</p>
        </article>
      </section>

      {!hasRecentMeasurement && (
        <section className="stale-panel">
          Aucune mesure récente n’est disponible pour ce lieu selon le seuil de{" "}
          {freshness?.thresholdMinutes || 30} minutes. Le lieu reste quand même
          visible afin de conserver une interface lisible.
        </section>
      )}

      <section className="scale-card">
        <h3>Échelles de classification exposées par l’API</h3>

        <div className="scale-grid">
          <div>
            <h4>Échelle phyphox relative</h4>
            <ul>
              <li>Calme : {currentAmbiance?.scale?.negativeScale?.calm}</li>
              <li>
                Modéré : {currentAmbiance?.scale?.negativeScale?.moderate}
              </li>
              <li>Animé : {currentAmbiance?.scale?.negativeScale?.active}</li>
            </ul>
          </div>

          <div>
            <h4>Échelle positive</h4>
            <ul>
              <li>Calme : {currentAmbiance?.scale?.positiveScale?.calm}</li>
              <li>
                Modéré : {currentAmbiance?.scale?.positiveScale?.moderate}
              </li>
              <li>Animé : {currentAmbiance?.scale?.positiveScale?.active}</li>
            </ul>
          </div>
        </div>
      </section>

      <HistoryChart history={history} />

      <QuietHoursList quietHours={quietHours} />

      {summary && (
        <section className="raw-summary">
          <h3>Résumé descriptif renvoyé par l’API</h3>
          <pre>{JSON.stringify(summary, null, 2)}</pre>
        </section>
      )}
    </div>
  );
}

export default LocationDetailPage;