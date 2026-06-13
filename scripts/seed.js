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

    const device = await Device.create({
      name: "iPhone de collecte",
      location: "bibliotheque-udem",
      apiKey: generateApiKey()
    });

    const now = new Date();

    await Measurement.insertMany([
      {
        type: "sound_level",
        value: 42.5,
        unit: "dB",
        location: "bibliotheque-udem",
        timestamp: new Date(now.getTime() - 3 * 60 * 60 * 1000),
        device: device._id
      },
      {
        type: "sound_level",
        value: 55.2,
        unit: "dB",
        location: "bibliotheque-udem",
        timestamp: new Date(now.getTime() - 2 * 60 * 60 * 1000),
        device: device._id
      },
      {
        type: "sound_level",
        value: 63.7,
        unit: "dB",
        location: "bibliotheque-udem",
        timestamp: new Date(now.getTime() - 60 * 60 * 1000),
        device: device._id
      },
      {
        type: "sound_level",
        value: 48.1,
        unit: "dB",
        location: "bibliotheque-udem",
        timestamp: new Date(now.getTime() - 20 * 60 * 1000),
        device: device._id
      }
    ]);

    await Observation.insertMany([
      {
        location: "bibliotheque-udem",
        proximity: "far",
        vibe: "calm",
        notes: "Peu de personnes autour.",
        timestamp: new Date(now.getTime() - 3 * 60 * 60 * 1000),
        device: device._id
      },
      {
        location: "bibliotheque-udem",
        proximity: "near",
        vibe: "busy",
        notes: "Plusieurs personnes présentes vers midi.",
        timestamp: new Date(now.getTime() - 2 * 60 * 60 * 1000),
        device: device._id
      },
      {
        location: "bibliotheque-udem",
        proximity: "medium",
        vibe: "normal",
        notes: "Ambiance modérée en fin de journée.",
        timestamp: new Date(now.getTime() - 20 * 60 * 1000),
        device: device._id
      }
    ]);

    console.log("Données seed insérées avec succès");
    console.log("Clé API de test :", device.apiKey);

    process.exit(0);
  } catch (error) {
    console.error("Erreur seed :", error);
    process.exit(1);
  }
}

seed();