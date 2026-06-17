const Device = require("../models/Device");

async function requireApiKey(req, res, next) {
  try {
    const apiKey = req.header("x-api-key");

    if (!apiKey) {
      return res.status(401).json({
        success: false,
        error: {
          code: "API_KEY_MISSING",
          message: "L'en-tête x-api-key est obligatoire"
        }
      });
    }

    const device = await Device.findOne({ apiKey });

    if (!device) {
      return res.status(403).json({
        success: false,
        error: {
          code: "API_KEY_INVALID",
          message: "La clé API est invalide"
        }
      });
    }

    req.device = device;
    next();
  } catch (error) {
    next(error);
  }
}

module.exports = requireApiKey;