import { getAmbianceMeta } from "../../utils/ambianceLabels";

function AmbianceBadge({ classification }) {
  const meta = getAmbianceMeta(classification);

  return (
    <span
      className={`ambiance-badge ${meta.className}`}
      title={meta.description}
      aria-label={`Classification d'ambiance : ${meta.label}`}
    >
      {meta.label}
    </span>
  );
}

export default AmbianceBadge;