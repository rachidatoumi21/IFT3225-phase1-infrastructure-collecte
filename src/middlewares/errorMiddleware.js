function errorMiddleware(error, req, res, next) {
  console.error(error);

  if (error.name === "ValidationError") {
    return res.status(400).json({
      success: false,
      error: {
        code: "VALIDATION_ERROR",
        message: Object.values(error.errors)
          .map((err) => err.message)
          .join(", ")
      }
    });
  }

  if (error.name === "CastError") {
    return res.status(400).json({
      success: false,
      error: {
        code: "INVALID_ID",
        message: "Identifiant invalide"
      }
    });
  }

  res.status(500).json({
    success: false,
    error: {
      code: "SERVER_ERROR",
      message: "Erreur interne du serveur"
    }
  });
}

module.exports = errorMiddleware;