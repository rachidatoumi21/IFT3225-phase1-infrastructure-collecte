/**
 * Bridge de collecte Phyphox → API
 * --------------------------------
 * Ce script interroge l'application Phyphox à intervalle régulier via son
 * API REST (fonction « accès distant ») et transmet chaque mesure sonore
 * à l'API du serveur via POST /api/measurements.
 *
 * Pré-requis côté téléphone :
 *   1. Ouvrir l'expérience « Intensité sonore » dans Phyphox.
 *   2. Menu (⋮) → « Activer l'accès distant ».
 *   3. Phyphox affiche une adresse de la forme http://192.168.x.x:8080
 *      Le téléphone et l'ordinateur doivent être sur le même réseau Wi-Fi.
 *   4. Démarrer la mesure (bouton ▶) dans Phyphox.
 *
 * Le nom du buffer (PHYPHOX_BUFFER) dépend de l'expérience. Pour l'expérience
 * « Intensité sonore », le buffer affichant la valeur en dB est généralement
 * « dB ». On peut vérifier les buffers disponibles en ouvrant dans un
 * navigateur : http://<ip-telephone>:8080/config
 *
 * Lancement :
 *   PHYPHOX_URL=http://192.168.1.42:8080 \
 *   API_KEY=<clé-du-device> \
 *   node scripts/bridge.js
 *
 * Variables d'environnement (voir .env.example) :
 *   PHYPHOX_URL     adresse de l'accès distant Phyphox (obligatoire)
 *   PHYPHOX_BUFFER  nom du buffer à lire (défaut : "dB")
 *   API_URL         URL de l'API (défaut : http://localhost:3000)
 *   API_KEY         clé API d'un device enregistré (obligatoire)
 *   LOCATION        lieu de collecte (défaut : "bibliotheque-udem")
 *   INTERVAL_MS     intervalle de collecte en ms (défaut : 5000)
 */

require("dotenv").config();

const PHYPHOX_URL = (process.env.PHYPHOX_URL || "").replace(/\/$/, "");
const PHYPHOX_BUFFER = process.env.PHYPHOX_BUFFER || "dB";
const API_URL = (process.env.API_URL || "http://localhost:3000").replace(
  /\/$/,
  ""
);
const API_KEY = process.env.API_KEY;
const LOCATION = process.env.LOCATION || "bibliotheque-udem";
const INTERVAL_MS = Number(process.env.INTERVAL_MS) || 5000;

function fail(message) {
  console.error(`❌ ${message}`);
  process.exit(1);
}

if (!PHYPHOX_URL) {
  fail(
    "PHYPHOX_URL est manquant. Exemple : PHYPHOX_URL=http://192.168.1.42:8080"
  );
}

if (!API_KEY) {
  fail("API_KEY est manquant. Utilisez la clé d'un device enregistré.");
}

let collected = 0;
let failures = 0;

/**
 * Lit la dernière valeur du buffer demandé depuis Phyphox.
 * Réponse attendue : { buffer: { <nom>: { buffer: [valeur] } }, status: {...} }
 */
async function readPhyphox() {
  const url = `${PHYPHOX_URL}/get?${encodeURIComponent(PHYPHOX_BUFFER)}`;
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Phyphox a répondu ${response.status}`);
  }

  const json = await response.json();
  const bufferData = json?.buffer?.[PHYPHOX_BUFFER]?.buffer;

  if (!Array.isArray(bufferData) || bufferData.length === 0) {
    return null;
  }

  const value = bufferData[bufferData.length - 1];

  if (typeof value !== "number" || Number.isNaN(value)) {
    return null;
  }

  return value;
}

/**
 * Transmet une mesure sonore à l'API.
 */
async function sendMeasurement(value) {
  const response = await fetch(`${API_URL}/api/measurements`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": API_KEY
    },
    body: JSON.stringify({
      type: "sound_level",
      value,
      unit: "dB",
      location: LOCATION,
      timestamp: new Date().toISOString()
    })
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`API a répondu ${response.status} : ${text}`);
  }

  return response.json();
}

async function tick() {
  try {
    const value = await readPhyphox();

    if (value === null) {
      console.warn(
        `⚠️  Aucune valeur lue dans le buffer "${PHYPHOX_BUFFER}". ` +
          "La mesure Phyphox est-elle démarrée ?"
      );
      return;
    }

    await sendMeasurement(value);
    collected += 1;
    console.log(
      `✅ [${new Date().toLocaleTimeString()}] ${value.toFixed(
        2
      )} dB transmis (total : ${collected})`
    );
  } catch (error) {
    failures += 1;
    console.error(`❌ Échec de collecte : ${error.message}`);

    if (failures >= 5 && collected === 0) {
      fail(
        "5 échecs consécutifs sans aucune mesure. Vérifiez PHYPHOX_URL, " +
          "le buffer, le réseau Wi-Fi et que la mesure est démarrée."
      );
    }
  }
}

console.log("--------------------------------------------");
console.log("Bridge de collecte Phyphox → API démarré");
console.log("Phyphox :", PHYPHOX_URL);
console.log("Buffer  :", PHYPHOX_BUFFER);
console.log("API     :", `${API_URL}/api/measurements`);
console.log("Lieu    :", LOCATION);
console.log("Intervalle :", `${INTERVAL_MS} ms`);
console.log("--------------------------------------------");
console.log("Ctrl+C pour arrêter.\n");

tick();
const timer = setInterval(tick, INTERVAL_MS);

function shutdown() {
  clearInterval(timer);
  console.log(
    `\nArrêt du bridge. ${collected} mesure(s) transmise(s), ${failures} échec(s).`
  );
  process.exit(0);
}

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
