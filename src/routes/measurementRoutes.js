const express = require("express");
const { body, query } = require("express-validator");

const {
  createMeasurement,
  getMeasurements
} = require("../controllers/measurementController");

const requireApiKey = require("../middlewares/authMiddleware");
const validateRequest = require("../middlewares/validateRequest");

const router = express.Router();

router.post(
  "/",
  requireApiKey,
  [
    body("type")
      .equals("sound_level")
      .withMessage("Le champ type doit être sound_level"),

    body("value")
      .isNumeric()
      .withMessage("Le champ value doit être numérique"),

    body("unit")
      .optional()
      .equals("dB")
      .withMessage("Le champ unit doit être dB"),

    body("location")
      .notEmpty()
      .withMessage("Le champ location est obligatoire"),

    body("timestamp")
      .isISO8601()
      .withMessage("Le champ timestamp doit être une date ISO 8601")
  ],
  validateRequest,
  createMeasurement
);

router.get(
  "/",
  [
    query("from")
      .optional()
      .isISO8601()
      .withMessage("Le paramètre from doit être une date ISO 8601"),

    query("to")
      .optional()
      .isISO8601()
      .withMessage("Le paramètre to doit être une date ISO 8601"),

    query("limit")
      .optional()
      .isInt({ min: 1, max: 500 })
      .withMessage("Le paramètre limit doit être entre 1 et 500")
  ],
  validateRequest,
  getMeasurements
);

module.exports = router;