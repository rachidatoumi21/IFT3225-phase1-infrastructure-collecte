function hasUsableRecentAmbiance(location) {
  const averageDb = location?.currentAmbiance?.averageDb;
  const isRecent = location?.currentAmbiance?.freshness?.isRecent;
  const level = location?.currentAmbiance?.classification?.level;

  return (
    typeof averageDb === "number" &&
    isRecent === true &&
    level !== "unknown"
  );
}

function sortLocationsByQuietestAverage(locations) {
  return [...locations].sort((a, b) => {
    return a.currentAmbiance.averageDb - b.currentAmbiance.averageDb;
  });
}

function selectQuietPlaceRecommendation(locations) {
  if (!Array.isArray(locations) || locations.length === 0) {
    return null;
  }

  const candidates = locations.filter(hasUsableRecentAmbiance);

  if (candidates.length === 0) {
    return null;
  }

  const sortedCandidates = sortLocationsByQuietestAverage(candidates);
  const recommendedLocation = sortedCandidates[0];

  return {
    slug: recommendedLocation.slug,
    name: recommendedLocation.name,
    description: recommendedLocation.description,
    address: recommendedLocation.address,
    latitude: recommendedLocation.latitude,
    longitude: recommendedLocation.longitude,
    averageDb: recommendedLocation.currentAmbiance.averageDb,
    classification: recommendedLocation.currentAmbiance.classification,
    freshness: recommendedLocation.currentAmbiance.freshness,
    reason:
      "Ce lieu est recommandé parce qu’il possède la moyenne sonore récente la plus basse parmi les lieux disponibles."
  };
}

module.exports = {
  hasUsableRecentAmbiance,
  sortLocationsByQuietestAverage,
  selectQuietPlaceRecommendation
};