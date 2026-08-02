const Location = require("../models/Location");
const Measurement = require("../models/Measurement");
const { classifyAmbiance } = require("../utils/classifyAmbiance");
const {
  selectQuietPlaceRecommendation
} = require("../services/recommendationService");

const FRESHNESS_THRESHOLD_MINUTES = 30;

async function getQuietPlaceRecommendation(req, res, next) {
  try {
    const now = new Date();
    const since = new Date(
      now.getTime() - FRESHNESS_THRESHOLD_MINUTES * 60 * 1000
    );

    const locations = await Location.find().sort({ name: 1 }).lean();

    const locationsWithAmbiance = await Promise.all(
      locations.map(async (location) => {
        const recentMeasurements = await Measurement.find({
          location: location.slug,
          type: "sound_level",
          timestamp: { $gte: since }
        })
          .sort({ timestamp: -1 })
          .lean();

        const recentMeasurementsCount = recentMeasurements.length;

        const averageDb =
          recentMeasurementsCount > 0
            ? recentMeasurements.reduce(
                (sum, measurement) => sum + Number(measurement.value),
                0
              ) / recentMeasurementsCount
            : null;

        const latestMeasurementAt =
          recentMeasurementsCount > 0 ? recentMeasurements[0].timestamp : null;

        const classification = classifyAmbiance(averageDb);

        return {
          slug: location.slug,
          name: location.name,
          description: location.description,
          address: location.address,
          latitude: location.latitude,
          longitude: location.longitude,
          type: location.type,
          currentAmbiance: {
            averageDb,
            unit: "dB",
            classification,
            freshness: {
              isRecent: recentMeasurementsCount > 0,
              thresholdMinutes: FRESHNESS_THRESHOLD_MINUTES,
              latestMeasurementAt,
              recentMeasurementsCount
            }
          }
        };
      })
    );

    const recommendation =
      selectQuietPlaceRecommendation(locationsWithAmbiance);

    if (!recommendation) {
      return res.status(200).json({
        success: true,
        data: null,
        message:
          "Aucune recommandation disponible parce qu’aucun lieu ne possède de mesure récente."
      });
    }

    return res.status(200).json({
      success: true,
      data: recommendation
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getQuietPlaceRecommendation
};