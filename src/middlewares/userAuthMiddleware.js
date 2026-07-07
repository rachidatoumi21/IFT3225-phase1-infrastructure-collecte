const jwt = require("jsonwebtoken");
const User = require("../models/User");

async function protectUser(req, res, next) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        error: {
          code: "AUTH_TOKEN_MISSING",
          message: "Token d'authentification manquant."
        }
      });
    }

    const token = authHeader.split(" ")[1];

    if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET est manquant dans le fichier .env");
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(401).json({
        success: false,
        error: {
          code: "USER_NOT_FOUND",
          message: "Utilisateur introuvable."
        }
      });
    }

    req.user = user;
    next();
  } catch (error) {
    if (error.name === "JsonWebTokenError" || error.name === "TokenExpiredError") {
      return res.status(401).json({
        success: false,
        error: {
          code: "INVALID_AUTH_TOKEN",
          message: "Token d'authentification invalide ou expiré."
        }
      });
    }

    next(error);
  }
}

module.exports = {
  protectUser
};