require("dotenv").config();

const PHYPOX_URL = (process.env.PHYPOX_URL || "").replace(/\/$/, "");
const PHYPOX_BUFFER = process.env.PHYPOX_BUFFER || "spl";

const API_BASE_URL = (process.env.API_BASE_URL || "http://localhost:3000/api").replace(/\/$/, "");
const API_KEY = process.env.API_KEY;

const LOCATION = process.env.COLLECTION_LOCATION || "bibliotheque-udem";
const INTERVAL_MS = Number(process.env.BRIDGE_INTERVAL_MS) || 5000;
const DURATION_MINUTES = Number(process.env.BRIDGE_DURATION_MINUTES) || 20;

function validateEnvironment() {
  if (!PHYPOX_URL) {
    throw new Error("PHYPOX_URL est manquant dans .env");
  }

  if (!API_KEY) {
    throw new Error("API_KEY est manquant dans .env");
  }
}

async function requestJson(url, options = {}) {
  const response = await fetch(url, options);

  const text = await response.text();

  let data;
  try {
    data = text ? JSON.parse(text) : {};
  } catch {
    data = text;
  }

  if (!response.ok) {
    throw new Error(`Erreur HTTP ${response.status} : ${JSON.stringify(data)}`);
  }

  return data;
}

async function startPhyphox() {
  try {
    await requestJson(`${PHYPOX_URL}/control?cmd=start`);
    console.log("phyphox démarré");
  } catch (error) {
    console.warn("Impossible de démarrer phyphox automatiquement :", error.message);
    console.warn("Tu peux appuyer sur Play manuellement dans phyphox.");
  }
}

async function stopPhyphox() {
  try {
    await requestJson(`${PHYPOX_URL}/control?cmd=stop`);
    console.log("phyphox arrêté");
  } catch (error) {
    console.warn("Impossible d'arrêter phyphox automatiquement :", error.message);
  }
}

async function readSoundLevelFromPhyphox() {
  const data = await requestJson(`${PHYPOX_URL}/get?${encodeURIComponent(PHYPOX_BUFFER)}`);

  const bufferData = data?.buffer?.[PHYPOX_BUFFER]?.buffer;

  if (!Array.isArray(bufferData) || bufferData.length === 0 || bufferData[0] === null) {
    throw new Error(
      `Aucune valeur reçue pour le buffer "${PHYPOX_BUFFER}". Vérifie PHYPOX_BUFFER avec npm run inspect:phyphox.`
    );
  }

  const value = Number(bufferData[bufferData.length - 1]);

  if (Number.isNaN(value)) {
    throw new Error(`Valeur non numérique reçue depuis phyphox : ${bufferData[bufferData.length - 1]}`);
  }

  return value;
}

async function postMeasurement(value) {
  const payload = {
    type: "sound_level",
    value,
    unit: "dB",
    location: LOCATION,
    timestamp: new Date().toISOString()
  };

  const data = await requestJson(`${API_BASE_URL}/measurements`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": API_KEY
    },
    body: JSON.stringify(payload)
  });

  return data;
}

async function collectOnce() {
  const value = await readSoundLevelFromPhyphox();
  const result = await postMeasurement(value);

  console.log(
    `[${new Date().toISOString()}] Mesure envoyée : ${value} dB → id=${result.data._id || result.data.id}`
  );
}

async function main() {
  validateEnvironment();

  console.log("Bridge phyphox → Express démarré");
  console.log(`phyphox : ${PHYPOX_URL}`);
  console.log(`buffer : ${PHYPOX_BUFFER}`);
  console.log(`API : ${API_BASE_URL}/measurements`);
  console.log(`lieu : ${LOCATION}`);
  console.log(`intervalle : ${INTERVAL_MS} ms`);
  console.log(`durée : ${DURATION_MINUTES} minutes`);

  await startPhyphox();

  const startedAt = Date.now();
  const durationMs = DURATION_MINUTES * 60 * 1000;

  await collectOnce();

  const timer = setInterval(async () => {
    try {
      const elapsed = Date.now() - startedAt;

      if (elapsed >= durationMs) {
        clearInterval(timer);
        await stopPhyphox();
        console.log("Collecte terminée");
        process.exit(0);
      }

      await collectOnce();
    } catch (error) {
      console.error("Erreur pendant la collecte :", error.message);
    }
  }, INTERVAL_MS);
}

main().catch((error) => {
  console.error("Erreur bridge :", error.message);
  process.exit(1);
});