const Observation = require("../models/Observation");

function buildObservationFilter(query) {
  const filter = {};

  if (query.location) {
    filter.location = query.location.toLowerCase();
  }

  if (query.proximity) {
    filter.proximity = query.proximity;
  }

  if (query.vibe) {
    filter.vibe = query.vibe;
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

async function createObservation(req, res, next) {
  try {
    const { location, proximity, vibe, notes, timestamp } = req.body;

    const observation = await Observation.create({
      location,
      proximity,
      vibe,
      notes,
      timestamp,
      device: req.device._id
    });

    res.status(201).json({
      success: true,
      data: observation
    });
  } catch (error) {
    next(error);
  }
}

async function getObservations(req, res, next) {
  try {
    const filter = buildObservationFilter(req.query);
    const limit = Number(req.query.limit) || 100;

    const observations = await Observation.find(filter)
      .sort({ timestamp: -1 })
      .limit(limit);

    res.status(200).json({
      success: true,
      count: observations.length,
      data: observations
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  createObservation,
  getObservations
};