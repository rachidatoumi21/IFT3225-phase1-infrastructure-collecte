import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";
import EmptyState from "../common/EmptyState";
import { formatNumber } from "../../utils/formatDate";

function formatHistoryLabel(value) {
  if (!value) {
    return "N/D";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return String(value);
  }

  return new Intl.DateTimeFormat("fr-CA", {
    hour: "2-digit",
    minute: "2-digit"
  }).format(date);
}

function normalizeHistoryPoints(history) {
  const rawPoints =
    history?.points ||
    history?.history ||
    history?.buckets ||
    history?.items ||
    history?.data ||
    [];

  return rawPoints
    .map((point, index) => {
      const value =
        point.averageDb ??
        point.avgDb ??
        point.averageSoundLevel ??
        point.average ??
        point.avg ??
        point.value ??
        null;

      const time =
        point.intervalStart ??
        point.start ??
        point.timestamp ??
        point.time ??
        point.hour ??
        `Point ${index + 1}`;

      return {
        label: formatHistoryLabel(time),
        rawTime: time,
        averageDb: value === null ? null : Number(value)
      };
    })
    .filter(
      (point) =>
        point.averageDb !== null &&
        point.averageDb !== undefined &&
        !Number.isNaN(point.averageDb)
    );
}

function HistoryChart({ history }) {
  const points = normalizeHistoryPoints(history);

  if (points.length === 0) {
    return (
      <EmptyState message="Aucun point d’historique disponible pour ce lieu." />
    );
  }

  return (
    <section className="chart-card">
      <h3>Historique sonore</h3>

      <p className="chart-help">
        Le graphe affiche les valeurs moyennes en dB renvoyées par l’API pour
        les intervalles d’historique disponibles.
      </p>

      <div className="chart-container">
        <ResponsiveContainer width="100%" height={300}>
          <LineChart
            data={points}
            margin={{ top: 20, right: 30, left: 10, bottom: 20 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="label" />
            <YAxis
              tickFormatter={(value) => formatNumber(value, 0)}
              label={{
                value: "dB",
                angle: -90,
                position: "insideLeft"
              }}
            />
            <Tooltip
              formatter={(value) => [`${formatNumber(value, 2)} dB`, "Moyenne"]}
              labelFormatter={(label) => `Temps : ${label}`}
            />
            <Line
              type="monotone"
              dataKey="averageDb"
              name="Moyenne dB"
              strokeWidth={2}
              dot
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}

export default HistoryChart;