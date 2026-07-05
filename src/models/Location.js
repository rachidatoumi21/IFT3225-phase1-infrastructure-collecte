const mongoose = require("mongoose");

const locationSchema = new mongoose.Schema(
  {
    slug: {
      type: String,
      required: [true, "L'identifiant du lieu est obligatoire"],
      unique: true,
      lowercase: true,
      trim: true
    },

    name: {
      type: String,
      required: [true, "Le nom du lieu est obligatoire"],
      trim: true
    },

    description: {
      type: String,
      default: ""
    },

    address: {
      type: String,
      default: ""
    },

    latitude: {
      type: Number,
      required: [true, "La latitude est obligatoire"]
    },

    longitude: {
      type: Number,
      required: [true, "La longitude est obligatoire"]
    },

    type: {
      type: String,
      enum: ["residential", "restaurant", "library", "other"],
      default: "other"
    },

    isActive: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Location", locationSchema);