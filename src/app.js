const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");

const deviceRoutes = require("./routes/deviceRoutes");
const measurementRoutes = require("./routes/measurementRoutes");
const observationRoutes = require("./routes/observationRoutes");
const ambianceRoutes = require("./routes/ambianceRoutes");

const errorMiddleware = require("./middlewares/errorMiddleware");
const locationRoutes = require("./routes/locationRoutes");
const authRoutes = require("./routes/authRoutes");
const accountRoutes = require("./routes/accountRoutes");
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
app.use("/api/measurements", measurementRoutes);
app.use("/api/observations", observationRoutes);
app.use("/api/ambiance", ambianceRoutes);
app.use("/api/locations", locationRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/account", accountRoutes);

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