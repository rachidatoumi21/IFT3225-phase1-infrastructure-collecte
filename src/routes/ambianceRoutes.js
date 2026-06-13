const express = require("express");

const {
  getAmbianceSummary,
  getAmbianceHistory,
  getQuietHours
} = require("../controllers/ambianceController");

const router = express.Router();

router.get("/:location/summary", getAmbianceSummary);

router.get("/:location/history", getAmbianceHistory);

router.get("/:location/quiet-hours", getQuietHours);

module.exports = router;