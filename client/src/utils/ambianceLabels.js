const AMBIANCE_META = {
  calm: {
    label: "Calme",
    className: "badge-calm"
  },

  moderate: {
    label: "Modéré",
    className: "badge-moderate"
  },

  active: {
    label: "Animé",
    className: "badge-active"
  },

  unknown: {
    label: "Inconnue",
    className: "badge-unknown"
  }
};

export function getAmbianceMeta(classification) {
  const level = classification?.level || "unknown";
  const apiLabel = classification?.label;

  const meta = AMBIANCE_META[level] || AMBIANCE_META.unknown;

  return {
    level,
    label: apiLabel || meta.label,
    className: meta.className,
    description:
      classification?.description ||
      "Aucune description de classification disponible."
  };
}