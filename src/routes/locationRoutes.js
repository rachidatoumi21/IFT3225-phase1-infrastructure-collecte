const express = require("express");
const router = express.Router();

const {
  getLocations,
  getLocationBySlug
} = require("../controllers/locationController");

router.get("/", getLocations);
router.get("/:slug", getLocationBySlug);

module.exports = router;