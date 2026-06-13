const express = require("express");
const { body, query } = require("express-validator");

const {
  createObservation,
  getObservations
} = require("../controllers/observationController");

const requireApiKey = require("../middlewares/authMiddleware");
const validateRequest = require("../middlewares/validateRequest");

const router = express.Router();

router.post(
  "/",
  requireApiKey,
  [
    body("location")
      .notEmpty()
      .withMessage("Le champ location est obligatoire"),

    body("proximity")
      .isIn(["near", "medium", "far"])
      .withMessage("Le champ proximity doit être near, medium ou far"),

    body("vibe")
      .isIn(["calm", "normal", "busy", "noisy"])
      .withMessage("Le champ vibe doit être calm, normal, busy ou noisy"),

    body("notes")
      .optional()
      .isString()
      .withMessage("Le champ notes doit être une chaîne de caractères"),

    body("timestamp")
      .isISO8601()
      .withMessage("Le champ timestamp doit être une date ISO 8601")
  ],
  validateRequest,
  createObservation
);

router.get(
  "/",
  [
    query("proximity")
      .optional()
      .isIn(["near", "medium", "far"])
      .withMessage("Le paramètre proximity doit être near, medium ou far"),

    query("vibe")
      .optional()
      .isIn(["calm", "normal", "busy", "noisy"])
      .withMessage("Le paramètre vibe doit être calm, normal, busy ou noisy"),

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
  getObservations
);

module.exports = router;