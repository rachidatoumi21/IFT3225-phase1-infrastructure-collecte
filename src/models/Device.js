const mongoose = require("mongoose");

const deviceSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Le nom du device est obligatoire"],
      trim: true
    },
    location: {
      type: String,
      required: [true, "Le lieu du device est obligatoire"],
      trim: true,
      lowercase: true
    },
    apiKey: {
      type: String,
      required: true,
      unique: true
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Device", deviceSchema);