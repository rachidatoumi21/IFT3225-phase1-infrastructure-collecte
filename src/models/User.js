const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Le nom est obligatoire."],
      trim: true,
      minlength: [2, "Le nom doit contenir au moins 2 caractères."],
      maxlength: [80, "Le nom ne peut pas dépasser 80 caractères."]
    },

    email: {
      type: String,
      required: [true, "L'adresse courriel est obligatoire."],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        "L'adresse courriel est invalide."
      ]
    },

    password: {
      type: String,
      required: [true, "Le mot de passe est obligatoire."],
      minlength: [8, "Le mot de passe doit contenir au moins 8 caractères."],
      select: false
    },

    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user"
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("User", userSchema);