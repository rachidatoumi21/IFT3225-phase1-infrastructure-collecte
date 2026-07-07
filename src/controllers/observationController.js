const Observation = require("../models/Observation");

async function createObservation(req, res, next) {
  try {
    const { location, proximity, vibe, notes, timestamp } = req.body;

    if (!location || !proximity || !vibe) {
      return res.status(400).json({
        success: false,
        error: {
          code: "VALIDATION_ERROR",
          message: "Les champs location, proximity et vibe sont obligatoires."
        }
      });
    }

    const observation = await Observation.create({
      location,
      proximity,
      vibe,
      notes: notes || "",
      timestamp: timestamp ? new Date(timestamp) : new Date(),
      author: req.user._id
    });

    const populatedObservation = await Observation.findById(
      observation._id
    ).populate("author", "name email role");

    res.status(201).json({
      success: true,
      message: "Observation créée avec succès.",
      data: populatedObservation
    });
  } catch (error) {
    next(error);
  }
}

async function getObservations(req, res, next) {
  try {
    const { location } = req.query;

    const filter = {};

    if (location) {
      filter.location = location;
    }

    const observations = await Observation.find(filter)
      .populate("author", "name email role")
      .sort({ timestamp: -1 })
      .limit(100);

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