const {
  hasUsableRecentAmbiance,
  selectQuietPlaceRecommendation,
  sortLocationsByQuietestAverage
} = require("../../src/services/recommendationService");

describe("recommendationService", () => {
  const locations = [
    {
      slug: "mcdonald",
      name: "McDonald",
      description: "Restaurant utilisé pour observer une ambiance animée.",
      address: "Montréal",
      latitude: 45.5,
      longitude: -73.6,
      currentAmbiance: {
        averageDb: -40,
        freshness: { isRecent: true },
        classification: { level: "moderate", label: "Modéré" }
      }
    },
    {
      slug: "bibliotheque-udem",
      name: "Bibliothèque UdeM",
      description: "Lieu utilisé pour observer une ambiance calme.",
      address: "Université de Montréal",
      latitude: 45.5,
      longitude: -73.6,
      currentAmbiance: {
        averageDb: -65,
        freshness: { isRecent: true },
        classification: { level: "calm", label: "Calme" }
      }
    },
    {
      slug: "maison-test",
      name: "Maison test",
      description: "Lieu résidentiel.",
      address: "Adresse privée",
      latitude: 45.5,
      longitude: -73.6,
      currentAmbiance: {
        averageDb: null,
        freshness: { isRecent: false },
        classification: { level: "unknown", label: "Inconnue" }
      }
    }
  ];

  it("identifie un lieu utilisable avec mesure récente et classification connue", () => {
    const result = hasUsableRecentAmbiance(locations[0]);

    expect(result).toBe(true);
  });

  it("ignore un lieu sans mesure récente", () => {
    const result = hasUsableRecentAmbiance(locations[2]);

    expect(result).toBe(false);
  });

  it("trie les lieux du plus calme au plus bruyant selon la moyenne récente", () => {
    const sorted = sortLocationsByQuietestAverage([locations[0], locations[1]]);

    expect(sorted[0].slug).toBe("bibliotheque-udem");
    expect(sorted[1].slug).toBe("mcdonald");
  });

  it("recommande le lieu calme avec la moyenne sonore récente la plus basse", () => {
    const recommendation = selectQuietPlaceRecommendation(locations);

    expect(recommendation.slug).toBe("bibliotheque-udem");
    expect(recommendation.name).toBe("Bibliothèque UdeM");
    expect(recommendation.averageDb).toBe(-65);
    expect(recommendation.classification.label).toBe("Calme");
  });

  it("retourne null si aucun lieu n’est utilisable", () => {
    const recommendation = selectQuietPlaceRecommendation([
      {
        slug: "lieu-inconnu",
        name: "Lieu inconnu",
        currentAmbiance: {
          averageDb: null,
          freshness: { isRecent: false },
          classification: { level: "unknown", label: "Inconnue" }
        }
      }
    ]);

    expect(recommendation).toBeNull();
  });

  it("retourne null lorsque la liste est vide ou invalide", () => {
    expect(selectQuietPlaceRecommendation([])).toBeNull();
    expect(selectQuietPlaceRecommendation(null)).toBeNull();
  });
});