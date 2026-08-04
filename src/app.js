const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");

const deviceRoutes = require("./routes/deviceRoutes");
const measurementRoutes = require("./routes/measurementRoutes");
const observationRoutes = require("./routes/observationRoutes");
const ambianceRoutes = require("./routes/ambianceRoutes");
const locationRoutes = require("./routes/locationRoutes");
const authRoutes = require("./routes/authRoutes");
const accountRoutes = require("./routes/accountRoutes");
const recommendationRoutes = require("./routes/recommendationRoutes");

const {
  cachePublicResponse,
  invalidatePublicCacheOnWrite,
  noStorePrivateResponse
} = require("./middlewares/cacheMiddleware");

const errorMiddleware = require("./middlewares/errorMiddleware");

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    data: {
      message: "IFT3225 Ambiance API fonctionne correctement",
      version: "1.0.0"
    }
  });
});

app.use("/api/devices", deviceRoutes);

// Lectures publiques mises en cache
app.use("/api/locations", cachePublicResponse(60 * 1000), locationRoutes);

app.use("/api/ambiance", cachePublicResponse(5 * 60 * 1000), ambianceRoutes);

app.use(
  "/api/recommendations",
  cachePublicResponse(60 * 1000),
  recommendationRoutes
);

// Écritures : jamais mises en cache et invalidation du cache public
app.use(
  "/api/measurements",
  invalidatePublicCacheOnWrite,
  measurementRoutes
);

app.use(
  "/api/observations",
  invalidatePublicCacheOnWrite,
  observationRoutes
);

// Routes privées : jamais mises en cache
app.use("/api/auth", noStorePrivateResponse, authRoutes);
app.use("/api/account", noStorePrivateResponse, accountRoutes);

app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: {
      code: "NOT_FOUND",
      message: "Endpoint introuvable"
    }
  });
});

app.use(errorMiddleware);

module.exports = app;