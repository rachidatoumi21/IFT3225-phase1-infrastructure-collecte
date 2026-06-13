const Measurement = require("../models/Measurement");

function buildMeasurementFilter(query) {
  const filter = {};

  if (query.location) {
    filter.location = query.location.toLowerCase();
  }

  if (query.type) {
    filter.type = query.type;
  }

  if (query.from || query.to) {
    filter.timestamp = {};

    if (query.from) {
      filter.timestamp.$gte = new Date(query.from);
    }

    if (query.to) {
      filter.timestamp.$lte = new Date(query.to);
    }
  }

  return filter;
}

async function createMeasurement(req, res, next) {
  try {
    const { type, value, unit, location, timestamp } = req.body;

    const measurement = await Measurement.create({
      type,
      value,
      unit,
      location,
      timestamp,
      device: req.device._id
    });

    res.status(201).json({
      success: true,
      data: measurement
    });
  } catch (error) {
    next(error);
  }
}

async function getMeasurements(req, res, next) {
  try {
    const filter = buildMeasurementFilter(req.query);
    const limit = Number(req.query.limit) || 100;

    const measurements = await Measurement.find(filter)
      .sort({ timestamp: -1 })
      .limit(limit);

    res.status(200).json({
      success: true,
      count: measurements.length,
      data: measurements
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  createMeasurement,
  getMeasurements
};