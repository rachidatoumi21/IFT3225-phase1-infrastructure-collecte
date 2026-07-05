const Location = require("../models/Location");
const Measurement = require("../models/Measurement");
const { classifyAmbiance, getClassificationScale } = require("../utils/classifyAmbiance");

const FRESHNESS_MINUTES = 30;

async function getLocations(req, res, next) {
  try {
    const locations = await Location.find({ isActive: true }).sort({ name: 1 });

    const now = new Date();
    const freshnessLimit = new Date(now.getTime() - FRESHNESS_MINUTES * 60 * 1000);

    const data = await Promise.all(
      locations.map(async (location) => {
        const recentMeasurements = await Measurement.find({
          location: location.slug,
          timestamp: { $gte: freshnessLimit }
        }).sort({ timestamp: -1 });

        const latestMeasurement = await Measurement.findOne({
          location: location.slug
        }).sort({ timestamp: -1 });

        let averageDb = null;

        if (recentMeasurements.length > 0) {
          const total = recentMeasurements.reduce((sum, item) => sum + item.value, 0);
          averageDb = Number((total / recentMeasurements.length).toFixed(2));
        }

        const classification = classifyAmbiance(averageDb);

        return {
          id: location._id,
          slug: location.slug,
          name: location.name,
          description: location.description,
          address: location.address,
          latitude: location.latitude,
          longitude: location.longitude,
          type: location.type,
          currentAmbiance: {
            averageDb,
            classification,
            scale: getClassificationScale(),
            freshness: {
              thresholdMinutes: FRESHNESS_MINUTES,
              isRecent: recentMeasurements.length > 0,
              latestMeasurementAt: latestMeasurement ? latestMeasurement.timestamp : null,
              recentMeasurementsCount: recentMeasurements.length
            }
          }
        };
      })
    );

    res.status(200).json({
      success: true,
      data
    });
  } catch (error) {
    next(error);
  }
}

async function getLocationBySlug(req, res, next) {
  try {
    const location = await Location.findOne({
      slug: req.params.slug,
      isActive: true
    });

    if (!location) {
      return res.status(404).json({
        success: false,
        error: {
          code: "LOCATION_NOT_FOUND",
          message: "Lieu introuvable."
        }
      });
    }

    res.status(200).json({
      success: true,
      data: location
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getLocations,
  getLocationBySlug
};