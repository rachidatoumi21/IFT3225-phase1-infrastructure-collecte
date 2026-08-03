const AMBIANCE_SCALES = {
  negativeScale: {
    calm: "<= -55 dB",
    moderate: "-55 à -35 dB",
    active: "> -35 dB"
  },
  positiveScale: {
    calm: "<= 45 dB",
    moderate: "45 à 65 dB",
    active: "> 65 dB"
  }
};

function classifyAmbiance(averageDb) {
  if (
    averageDb === null ||
    averageDb === undefined ||
    Number.isNaN(Number(averageDb))
  ) {
    return {
      level: "unknown",
      label: "Inconnue",
      description:
        "Aucune mesure récente n’est disponible pour classifier ce lieu."
    };
  }

  const value = Number(averageDb);

  if (value < 0) {
    if (value <= -55) {
      return {
        level: "calm",
        label: "Calme",
        description: "Ambiance calme selon la moyenne sonore récente."
      };
    }

    if (value <= -35) {
      return {
        level: "moderate",
        label: "Modéré",
        description: "Ambiance modérée selon la moyenne sonore récente."
      };
    }

    return {
      level: "active",
      label: "Animé",
      description: "Ambiance animée selon la moyenne sonore récente."
    };
  }

  if (value <= 45) {
    return {
      level: "calm",
      label: "Calme",
      description: "Ambiance calme selon la moyenne sonore récente."
    };
  }

  if (value <= 65) {
    return {
      level: "moderate",
      label: "Modéré",
      description: "Ambiance modérée selon la moyenne sonore récente."
    };
  }

  return {
    level: "active",
    label: "Animé",
    description: "Ambiance animée selon la moyenne sonore récente."
  };
}

function getAmbianceScales() {
  return AMBIANCE_SCALES;
}

module.exports = {
  AMBIANCE_SCALES,
  classifyAmbiance,
  getAmbianceScales
};