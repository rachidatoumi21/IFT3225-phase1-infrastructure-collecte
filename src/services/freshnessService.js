const DEFAULT_FRESHNESS_THRESHOLD_MINUTES = 30;

function getFreshnessLimitDate(now = new Date(), thresholdMinutes = DEFAULT_FRESHNESS_THRESHOLD_MINUTES) {
  return new Date(now.getTime() - thresholdMinutes * 60 * 1000);
}

function isMeasurementRecent(
  measurementDate,
  now = new Date(),
  thresholdMinutes = DEFAULT_FRESHNESS_THRESHOLD_MINUTES
) {
  if (!measurementDate) {
    return false;
  }

  const date = new Date(measurementDate);

  if (Number.isNaN(date.getTime())) {
    return false;
  }

  const limitDate = getFreshnessLimitDate(now, thresholdMinutes);

  return date >= limitDate && date <= now;
}

function buildFreshnessMetadata({
  latestMeasurementAt,
  recentMeasurementsCount = 0,
  thresholdMinutes = DEFAULT_FRESHNESS_THRESHOLD_MINUTES,
  now = new Date()
}) {
  const isRecent =
    recentMeasurementsCount > 0 &&
    isMeasurementRecent(latestMeasurementAt, now, thresholdMinutes);

  return {
    isRecent,
    thresholdMinutes,
    latestMeasurementAt: latestMeasurementAt || null,
    recentMeasurementsCount
  };
}

module.exports = {
  DEFAULT_FRESHNESS_THRESHOLD_MINUTES,
  getFreshnessLimitDate,
  isMeasurementRecent,
  buildFreshnessMetadata
};