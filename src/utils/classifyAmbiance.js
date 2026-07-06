function classifyAmbiance(averageDb) {
  if (averageDb === null || averageDb === undefined || Number.isNaN(Number(averageDb))) {
    return {
      level: "unknown",
      label: "Inconnue",
      description: "Aucune mesure récente n’est disponible pour classifier ce lieu."
    };
  }

  const value = Number(averageDb);

  if (value <= -55 || value <= 45) {
    return {
      level: "calm",
      label: "Calme",
      description: "Ambiance calme selon la moyenne sonore récente."
    };
  }

  if ((value > -55 && value <= -35) || (value > 45 && value <= 65)) {
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

module.exports = {
  classifyAmbiance
};