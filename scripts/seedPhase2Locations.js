require("dotenv").config();

const connectDB = require("../src/config/db");
const Location = require("../src/models/Location");

async function seedPhase2Locations() {
  await connectDB();

  const locations = [
    {
      slug: "maison-test",
      name: "Maison test",
      description: "Lieu résidentiel utilisé comme référence calme pour la phase 2.",
      address: "11700 rue Pasteur, Montréal, Qc H3M 2P3",
      latitude: 45.536354,
      longitude: -73.690559,
      type: "residential"
    },
    {
      slug: "mcdonald",
      name: "McDonald",
      description: "Restaurant rapide utilisé comme lieu public animé.",
      address: "443 Bd Adolphe-Chapleau, Bois-des-Filion, QC J6Z 1H9",
      latitude: 45.667048,
      longitude: -73.758316,
      type: "restaurant"

    },
    {
      slug: "bibliotheque-udem",
      name: "Bibliothèque UdeM",
      description: "Lieu d’étude utilisé pour comparer une ambiance modérée.",
      address: "2900 boulevard Édouard-Montpetit, Montréal, QC",
      latitude: 45.503660,
      longitude: -73.615594,
      type: "library"
    } 
  ];

  for (const location of locations) {
    await Location.findOneAndUpdate(
      { slug: location.slug },
      location,
      { upsert: true, new: true, runValidators: true }
    );
  }

  console.log("Lieux de la phase 2 ajoutés ou mis à jour avec succès.");
  process.exit(0);
}

seedPhase2Locations().catch((error) => {
  console.error("Erreur pendant l'insertion des lieux :", error);
  process.exit(1);
});