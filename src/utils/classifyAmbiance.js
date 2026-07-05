function classifyAmbiance(avgDb) {
  if (avgDb === null || avgDb === undefined || Number.isNaN(avgDb)) {
    return {
      label: "inconnue",
      level: "unknown",
      description: "Aucune mesure disponible pour classifier l'ambiance."
    };
  }

  if (avgDb < 0) {
    if (avgDb <= -60) {
      return {
        label: "calme",
        level: "calm",
        description: "Ambiance calme selon les mesures relatives de phyphox."
      };
    }

    if (avgDb <= -45) {
      return {
        label: "modéré",
        level: "moderate",
        description: "Ambiance modérée selon les mesures relatives de phyphox."
      };
    }

    return {
      label: "animé",
      level: "active",
      description: "Ambiance animée selon les mesures relatives de phyphox."
    };
  }

  if (avgDb < 45) {
    return {
      label: "calme",
      level: "calm",
      description: "Ambiance calme selon une échelle sonore positive."
    };
  }

  if (avgDb <= 60) {
    return {
      label: "modéré",
      level: "moderate",
      description: "Ambiance modérée selon une échelle sonore positive."
    };
  }

  return {
    label: "animé",
    level: "active",
    description: "Ambiance animée selon une échelle sonore positive."
  };
}

function getClassificationScale() {
  return {
    negativeScale: {
      unit: "dB",
      source: "phyphox relatif",
      calm: "≤ -60 dB",
      moderate: "> -60 dB et ≤ -45 dB",
      active: "> -45 dB"
    },
    positiveScale: {
      unit: "dB SPL",
      source: "échelle positive",
      calm: "< 45 dB",
      moderate: "45 à 60 dB",
      active: "> 60 dB"
    }
  };
}

module.exports = {
  classifyAmbiance,
  getClassificationScale
};