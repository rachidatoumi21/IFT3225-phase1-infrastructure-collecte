const express = require("express");

const {
  getLocations,
  getLocationBySlug
} = require("../controllers/locationController");

const router = express.Router();

router.get("/", getLocations);
router.get("/:slug", getLocationBySlug);

module.exports = router;