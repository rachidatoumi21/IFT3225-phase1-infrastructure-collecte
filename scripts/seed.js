require("dotenv").config();

const connectDB = require("../src/config/db");
const Device = require("../src/models/Device");
const Measurement = require("../src/models/Measurement");
const Observation = require("../src/models/Observation");
const generateApiKey = require("../src/utils/generateApiKey");

async function seed() {
  try {
    await connectDB();

    await Device.deleteMany();
    await Measurement.deleteMany();
    await Observation.deleteMany();

    // --- Devices ---
    const deviceMatin = await Device.create({
      name: "iPhone session matin",
      location: "bibliotheque-udem",
      apiKey: generateApiKey()
    });

    const deviceMidi = await Device.create({
      name: "iPhone session midi",
      location: "bibliotheque-udem",
      apiKey: generateApiKey()
    });

    // --- Measurements (3 sessions, dB SPL positive values) ---
    // Session matin ~9h30
    await Measurement.insertMany([
      {
        type: "sound_level",
        value: 38.5,
        unit: "dB",
        location: "bibliotheque-udem",
        timestamp: new Date("2026-05-27T09:30:00.000Z"),
        device: deviceMatin._id
      },
      {
        type: "sound_level",
        value: 36.2,
        unit: "dB",
        location: "bibliotheque-udem",
        timestamp: new Date("2026-05-27T09:40:00.000Z"),
        device: deviceMatin._id
      },
      {
        type: "sound_level",
        value: 51.8,
        unit: "dB",
        location: "bibliotheque-udem",
        timestamp: new Date("2026-05-27T09:50:00.000Z"),
        device: deviceMatin._id
      },
      // Session midi ~12h00
      {
        type: "sound_level",
        value: 64.5,
        unit: "dB",
        location: "bibliotheque-udem",
        timestamp: new Date("2026-05-27T12:00:00.000Z"),
        device: deviceMidi._id
      },
      {
        type: "sound_level",
        value: 68.1,
        unit: "dB",
        location: "bibliotheque-udem",
        timestamp: new Date("2026-05-27T12:10:00.000Z"),
        device: deviceMidi._id
      },
      {
        type: "sound_level",
        value: 55.4,
        unit: "dB",
        location: "bibliotheque-udem",
        timestamp: new Date("2026-05-27T12:20:00.000Z"),
        device: deviceMidi._id
      },
      // Session soir ~17h30
      {
        type: "sound_level",
        value: 52.7,
        unit: "dB",
        location: "bibliotheque-udem",
        timestamp: new Date("2026-05-27T17:30:00.000Z"),
        device: deviceMatin._id
      },
      {
        type: "sound_level",
        value: 47.3,
        unit: "dB",
        location: "bibliotheque-udem",
        timestamp: new Date("2026-05-27T17:50:00.000Z"),
        device: deviceMatin._id
      }
    ]);

    // --- Observations (from manual_observations.csv) ---
    await Observation.insertMany([
      {
        location: "bibliotheque-udem",
        proximity: "far",
        vibe: "calm",
        notes: "Session matin - peu de personnes autour",
        timestamp: new Date("2026-05-27T09:30:00.000Z"),
        device: deviceMatin._id
      },
      {
        location: "bibliotheque-udem",
        proximity: "far",
        vibe: "calm",
        notes: "Session matin - ambiance calme",
        timestamp: new Date("2026-05-27T09:40:00.000Z"),
        device: deviceMatin._id
      },
      {
        location: "bibliotheque-udem",
        proximity: "medium",
        vibe: "normal",
        notes: "Session matin - quelques personnes proches",
        timestamp: new Date("2026-05-27T09:50:00.000Z"),
        device: deviceMatin._id
      },
      {
        location: "bibliotheque-udem",
        proximity: "near",
        vibe: "busy",
        notes: "Session midi - plusieurs personnes presentes",
        timestamp: new Date("2026-05-27T12:00:00.000Z"),
        device: deviceMidi._id
      },
      {
        location: "bibliotheque-udem",
        proximity: "near",
        vibe: "busy",
        notes: "Session midi - discussions proches",
        timestamp: new Date("2026-05-27T12:10:00.000Z"),
        device: deviceMidi._id
      },
      {
        location: "bibliotheque-udem",
        proximity: "medium",
        vibe: "normal",
        notes: "Session midi - ambiance moderee",
        timestamp: new Date("2026-05-27T12:20:00.000Z"),
        device: deviceMidi._id
      },
      {
        location: "bibliotheque-udem",
        proximity: "medium",
        vibe: "normal",
        notes: "Session soir - ambiance moderee",
        timestamp: new Date("2026-05-27T17:30:00.000Z"),
        device: deviceMatin._id
      },
      {
        location: "bibliotheque-udem",
        proximity: "near",
        vibe: "busy",
        notes: "Session soir - plus de mouvement",
        timestamp: new Date("2026-05-27T17:40:00.000Z"),
        device: deviceMatin._id
      },
      {
        location: "bibliotheque-udem",
        proximity: "far",
        vibe: "calm",
        notes: "Session soir - retour au calme",
        timestamp: new Date("2026-05-27T17:50:00.000Z"),
        device: deviceMatin._id
      }
    ]);

    console.log("✅ Données seed insérées avec succès");
    console.log("--------------------------------------------");
    console.log("Clé API — iPhone session matin :", deviceMatin.apiKey);
    console.log("Clé API — iPhone session midi  :", deviceMidi.apiKey);
    console.log("--------------------------------------------");
    console.log("8 mesures sonores insérées");
    console.log("9 observations environnementales insérées");

    process.exit(0);
  } catch (error) {
    console.error("Erreur seed :", error);
    process.exit(1);
  }
}

seed();
