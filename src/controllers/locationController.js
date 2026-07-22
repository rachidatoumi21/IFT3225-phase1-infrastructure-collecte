const Location = require("../models/Location");
const Measurement = require("../models/Measurement");
const { classifyAmbiance } = require("../utils/classifyAmbiance");

async function buildCurrentAmbiance(locationSlug) {
  const freshnessThresholdMinutes = 30;
  const since = new Date(Date.now() - freshnessThresholdMinutes * 60 * 1000);

  const latestMeasurement = await Measurement.findOne({
    location: locationSlug
  }).sort({ timestamp: -1 });

  const recentMeasurements = await Measurement.find({
    location: locationSlug,
    timestamp: { $gte: since }
  });

  if (recentMeasurements.length === 0) {
    return {
      averageDb: null,
      classification: classifyAmbiance(null),
      scale: {
        negativeScale: {
          calm: "≤ -55 dB",
          moderate: "-55 à -35 dB",
          active: "> -35 dB"
        },
        positiveScale: {
          calm: "≤ 45 dB",
          moderate: "45 à 65 dB",
          active: "> 65 dB"
        }
      },
      freshness: {
        thresholdMinutes: freshnessThresholdMinutes,
        isRecent: false,
        latestMeasurementAt: latestMeasurement?.timestamp || null,
        recentMeasurementsCount: 0
      }
    };
  }

  const sum = recentMeasurements.reduce(
    (total, measurement) => total + Number(measurement.value),
    0
  );

  const averageDb = sum / recentMeasurements.length;

  return {
    averageDb,
    classification: classifyAmbiance(averageDb),
    scale: {
      negativeScale: {
        calm: "≤ -55 dB",
        moderate: "-55 à -35 dB",
        active: "> -35 dB"
      },
      positiveScale: {
        calm: "≤ 45 dB",
        moderate: "45 à 65 dB",
        active: "> 65 dB"
      }
    },
    freshness: {
      thresholdMinutes: freshnessThresholdMinutes,
      isRecent: true,
      latestMeasurementAt: latestMeasurement?.timestamp || null,
      recentMeasurementsCount: recentMeasurements.length
    }
  };
}

async function getLocations(req, res, next) {
  try {
    const locations = await Location.find().sort({ name: 1 });

    const data = await Promise.all(
      locations.map(async (location) => {
        const currentAmbiance = await buildCurrentAmbiance(location.slug);

        return {
          id: location._id,
          slug: location.slug,
          name: location.name,
          description: location.description,
          address: location.address,
          latitude: location.latitude,
          longitude: location.longitude,
          type: location.type,
          currentAmbiance
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
    const location = await Location.findOne({ slug: req.params.slug });

    if (!location) {
      return res.status(404).json({
        success: false,
        error: {
          code: "LOCATION_NOT_FOUND",
          message: "Lieu introuvable."
        }
      });
    }

    const currentAmbiance = await buildCurrentAmbiance(location.slug);

    res.status(200).json({
      success: true,
      data: {
        id: location._id,
        slug: location.slug,
        name: location.name,
        description: location.description,
        address: location.address,
        latitude: location.latitude,
        longitude: location.longitude,
        type: location.type,
        currentAmbiance
      }
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getLocations,
  getLocationBySlug
};