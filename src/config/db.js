const mongoose = require("mongoose");

async function connectDB() {
  try {
    if (!process.env.MONGODB_URI) {
      throw new Error("MONGODB_URI est manquant dans le fichier .env");
    }

    await mongoose.connect(process.env.MONGODB_URI);

    console.log("Connexion MongoDB Atlas réussie");
  } catch (error) {
    console.error("Erreur de connexion MongoDB :", error.message);
    process.exit(1);
  }
}

module.exports = connectDB;