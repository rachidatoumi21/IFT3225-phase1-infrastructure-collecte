const mongoose = require("mongoose");

const measurementSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      required: [true, "Le type de mesure est obligatoire"],
      enum: ["sound_level"]
    },
    value: {
      type: Number,
      required: [true, "La valeur de mesure est obligatoire"],
    },
    unit: {
      type: String,
      required: [true, "L'unité est obligatoire"],
      enum: ["dB"],
      default: "dB"
    },
    location: {
      type: String,
      required: [true, "Le lieu est obligatoire"],
      trim: true,
      lowercase: true
    },
    timestamp: {
      type: Date,
      required: [true, "Le timestamp est obligatoire"]
    },
    receivedAt: {
      type: Date,
      default: Date.now
    },
    device: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Device"
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Measurement", measurementSchema);