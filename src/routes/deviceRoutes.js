const express = require("express");
const { body } = require("express-validator");

const {
  createDevice,
  getDevices
} = require("../controllers/deviceController");

const validateRequest = require("../middlewares/validateRequest");

const router = express.Router();

router.post(
  "/",
  [
    body("name")
      .notEmpty()
      .withMessage("Le champ name est obligatoire")
      .isString()
      .withMessage("Le champ name doit être une chaîne de caractères"),

    body("location")
      .notEmpty()
      .withMessage("Le champ location est obligatoire")
      .isString()
      .withMessage("Le champ location doit être une chaîne de caractères")
  ],
  validateRequest,
  createDevice
);

router.get("/", getDevices);

module.exports = router;