import EmptyState from "../common/EmptyState";
import { formatNumber } from "../../utils/formatDate";

function normalizeQuietHours(quietHours) {
  const rawItems =
    quietHours?.quietHours ||
    quietHours?.periods ||
    quietHours?.hours ||
    quietHours?.items ||
    quietHours?.data ||
    [];

  return rawItems.map((item, index) => {
    const label =
      item.hour ??
      item.period ??
      item.time ??
      item.start ??
      item.intervalStart ??
      `Créneau ${index + 1}`;

    const averageDb =
      item.averageDb ??
      item.avgDb ??
      item.averageSoundLevel ??
      item.average ??
      item.avg ??
      item.value ??
      null;

    const count =
      item.count ??
      item.measurementsCount ??
      item.total ??
      item.numberOfMeasurements ??
      null;

    return {
      label,
      averageDb,
      count
    };
  });
}

function QuietHoursList({ quietHours }) {
  const items = normalizeQuietHours(quietHours);

  if (items.length === 0) {
    return (
      <EmptyState message="Aucun créneau calme disponible pour ce lieu." />
    );
  }

  return (
    <section className="quiet-card">
      <h3>Créneaux calmes</h3>

      <p className="chart-help">
        Ces créneaux sont calculés par l’API à partir des mesures stockées. Le
        client React les affiche sans recalculer l’interprétation.
      </p>

      <ul className="quiet-list">
        {items.map((item, index) => (
          <li key={`${item.label}-${index}`}>
            <div>
              <strong>{item.label}</strong>
              {item.count !== null && (
                <span className="quiet-count">
                  {item.count} mesure{item.count > 1 ? "s" : ""}
                </span>
              )}
            </div>

            <span>{formatNumber(item.averageDb, 2)} dB</span>
          </li>
        ))}
      </ul>
    </section>
  );
}

export default QuietHoursList;