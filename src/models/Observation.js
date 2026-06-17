const mongoose = require("mongoose");

const observationSchema = new mongoose.Schema(
  {
    location: {
      type: String,
      required: [true, "Le lieu est obligatoire"],
      trim: true,
      lowercase: true
    },
    proximity: {
      type: String,
      required: [true, "La proximité humaine est obligatoire"],
      enum: ["near", "medium", "far"]
    },
    vibe: {
      type: String,
      required: [true, "La vibe est obligatoire"],
      enum: ["calm", "normal", "busy", "noisy"]
    },
    notes: {
      type: String,
      trim: true,
      default: ""
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

module.exports = mongoose.model("Observation", observationSchema);