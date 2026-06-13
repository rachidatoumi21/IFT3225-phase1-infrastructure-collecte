const Measurement = require("../models/Measurement");
const Observation = require("../models/Observation");

function classifySoundLevel(value) {
  if (value < 45) return "calm";
  if (value < 60) return "normal";
  if (value < 75) return "busy";
  return "noisy";
}

function parseLastDuration(last = "30m") {
  const match = last.match(/^(\d+)(m|h)$/);

  if (!match) {
    return 30 * 60 * 1000;
  }

  const value = Number(match[1]);
  const unit = match[2];

  if (unit === "h") {
    return value * 60 * 60 * 1000;
  }

  return value * 60 * 1000;
}

async function getAmbianceSummary(req, res, next) {
  try {
    const location = req.params.location.toLowerCase();
    const now = new Date();
    const since = new Date(now.getTime() - 30 * 60 * 1000);

    const measurements = await Measurement.find({
      location,
      timestamp: { $gte: since }
    });

    const latestObservation = await Observation.findOne({ location }).sort({
      timestamp: -1
    });

    if (measurements.length === 0 && !latestObservation) {
      return res.status(404).json({
        success: false,
        error: {
          code: "NO_DATA_FOUND",
          message: "Aucune donnée disponible pour ce lieu"
        }
      });
    }

    let averageSoundLevel = null;
    let classification = latestObservation ? latestObservation.vibe : "unknown";

    if (measurements.length > 0) {
      const total = measurements.reduce((sum, item) => sum + item.value, 0);
      averageSoundLevel = Number((total / measurements.length).toFixed(2));
      classification = classifySoundLevel(averageSoundLevel);
    }

    res.status(200).json({
      success: true,
      data: {
        location,
        averageSoundLevel,
        unit: averageSoundLevel === null ? null : "dB",
        vibe: latestObservation ? latestObservation.vibe : null,
        proximity: latestObservation ? latestObservation.proximity : null,
        classification,
        window: "last_30_minutes"
      }
    });
  } catch (error) {
    next(error);
  }
}

async function getAmbianceHistory(req, res, next) {
  try {
    const location = req.params.location.toLowerCase();
    const last = req.query.last || "3h";
    const duration = parseLastDuration(last);

    const now = new Date();
    const since = new Date(now.getTime() - duration);

    const measurements = await Measurement.find({
      location,
      timestamp: { $gte: since }
    }).sort({ timestamp: 1 });

    const intervalMs = 10 * 60 * 1000;
    const buckets = new Map();

    measurements.forEach((measurement) => {
      const time = new Date(measurement.timestamp).getTime();
      const bucketStart = Math.floor(time / intervalMs) * intervalMs;
      const key = new Date(bucketStart).toISOString();

      if (!buckets.has(key)) {
        buckets.set(key, []);
      }

      buckets.get(key).push(measurement.value);
    });

    const points = Array.from(buckets.entries()).map(([time, values]) => {
      const average =
        values.reduce((sum, value) => sum + value, 0) / values.length;

      return {
        time,
        averageSoundLevel: Number(average.toFixed(2)),
        classification: classifySoundLevel(average)
      };
    });

    res.status(200).json({
      success: true,
      data: {
        location,
        last,
        interval: "10min",
        points
      }
    });
  } catch (error) {
    next(error);
  }
}

async function getQuietHours(req, res, next) {
  try {
    const location = req.params.location.toLowerCase();

    const measurements = await Measurement.find({ location });

    if (measurements.length === 0) {
      return res.status(404).json({
        success: false,
        error: {
          code: "NO_MEASUREMENTS_FOUND",
          message: "Aucune mesure sonore disponible pour ce lieu"
        }
      });
    }

    const buckets = new Map();

    measurements.forEach((measurement) => {
      const date = new Date(measurement.timestamp);
      const hour = date.getHours();
      const key = `${hour.toString().padStart(2, "0")}:00-${(hour + 1)
        .toString()
        .padStart(2, "0")}:00`;

      if (!buckets.has(key)) {
        buckets.set(key, []);
      }

      buckets.get(key).push(measurement.value);
    });

    const quietHours = Array.from(buckets.entries())
      .map(([period, values]) => {
        const average =
          values.reduce((sum, value) => sum + value, 0) / values.length;

        return {
          period,
          averageSoundLevel: Number(average.toFixed(2)),
          classification: classifySoundLevel(average)
        };
      })
      .sort((a, b) => a.averageSoundLevel - b.averageSoundLevel)
      .slice(0, 3);

    res.status(200).json({
      success: true,
      data: {
        location,
        quietHours
      }
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getAmbianceSummary,
  getAmbianceHistory,
  getQuietHours
};