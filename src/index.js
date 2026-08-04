require("dotenv").config();

const app = require("./app");
const connectDB = require("./config/db");

const PORT = process.env.PORT || 3000;

async function startServer() {
  try {
    await connectDB();

    app.listen(PORT, () => {
      console.log(`Serveur démarré sur le port ${PORT}`);
      console.log(`URL locale : http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Erreur au démarrage du serveur :", error.message);
    process.exit(1);
  }
}

startServer();