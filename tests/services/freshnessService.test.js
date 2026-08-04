const {
  buildFreshnessMetadata,
  getFreshnessLimitDate,
  isMeasurementRecent
} = require("../../src/services/freshnessService");

describe("freshnessService", () => {
  const now = new Date("2026-07-20T12:00:00.000Z");

  it("considère une mesure de moins de 30 minutes comme récente", () => {
    const result = isMeasurementRecent(
      "2026-07-20T11:45:00.000Z",
      now,
      30
    );

    expect(result).toBe(true);
  });

  it("considère une mesure trop ancienne comme non récente", () => {
    const result = isMeasurementRecent(
      "2026-07-20T10:00:00.000Z",
      now,
      30
    );

    expect(result).toBe(false);
  });

  it("refuse une date absente ou invalide", () => {
    expect(isMeasurementRecent(null, now, 30)).toBe(false);
    expect(isMeasurementRecent("date-invalide", now, 30)).toBe(false);
  });

  it("refuse une date dans le futur", () => {
    const result = isMeasurementRecent(
      "2026-07-20T12:30:00.000Z",
      now,
      30
    );

    expect(result).toBe(false);
  });

  it("calcule correctement la date limite de fraîcheur", () => {
    const limitDate = getFreshnessLimitDate(now, 30);

    expect(limitDate.toISOString()).toBe("2026-07-20T11:30:00.000Z");
  });

  it("construit les métadonnées de fraîcheur", () => {
    const metadata = buildFreshnessMetadata({
      latestMeasurementAt: "2026-07-20T11:50:00.000Z",
      recentMeasurementsCount: 3,
      thresholdMinutes: 30,
      now
    });

    expect(metadata.isRecent).toBe(true);
    expect(metadata.thresholdMinutes).toBe(30);
    expect(metadata.recentMeasurementsCount).toBe(3);
  });
});