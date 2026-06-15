require("dotenv").config();

const PHYPOX_URL = (process.env.PHYPOX_URL || "").replace(/\/$/, "");

async function main() {
  if (!PHYPOX_URL) {
    console.error("Erreur : PHYPOX_URL est manquant dans .env");
    process.exit(1);
  }

  const response = await fetch(`${PHYPOX_URL}/config`);

  if (!response.ok) {
    throw new Error(`Impossible de lire phyphox : ${response.status}`);
  }

  const config = await response.json();

  console.log("Expérience phyphox :", config.title || config.localTitle);
  console.log("\nBuffers disponibles :");

  if (Array.isArray(config.buffers)) {
    config.buffers.forEach((buffer) => {
      console.log(`- ${buffer.name}`);
    });
  } else {
    console.log("Aucun buffer trouvé dans /config");
  }

  console.log("\nConseil : cherche un buffer lié à SPL, sound, dB ou audio.");
}

main().catch((error) => {
  console.error("Erreur inspect phyphox :", error.message);
  process.exit(1);
});