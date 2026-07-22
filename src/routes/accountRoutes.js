const express = require("express");
const {
  getMyObservations,
  getMyPlaces,
  getMyFavorites,
  addFavoriteLocation,
  removeFavoriteLocation
} = require("../controllers/accountController");
const { protectUser } = require("../middlewares/userAuthMiddleware");

const router = express.Router();

router.get("/observations", protectUser, getMyObservations);
router.get("/places", protectUser, getMyPlaces);

router.get("/favorites", protectUser, getMyFavorites);
router.post("/favorites/:slug", protectUser, addFavoriteLocation);
router.delete("/favorites/:slug", protectUser, removeFavoriteLocation);

module.exports = router;