const express = require("express");
const {
  getQuietPlaceRecommendation
} = require("../controllers/recommendationController");

const router = express.Router();

router.get("/quiet-place", getQuietPlaceRecommendation);

module.exports = router;