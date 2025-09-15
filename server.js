// server.js (oswa src/index.js) — CommonJS + Sequelize
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const sequelize = require("./src/config/db");   // si dosye a nan rasin 'server/'
// NOTE: si w ap mete fichye sa a nan src/index.js, chemen an vin: './config/db'

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// (OPSYONÈL) Si w gen routes yo:
try {
  const memberRoutes = require("./src/routes/members");
  const eventRoutes = require("./src/routes/events");
  const donationRoutes = require("./src/routes/donations");

  app.use("/api/members", memberRoutes);
  app.use("/api/events", eventRoutes);
  app.use("/api/donations", donationRoutes);
} catch (e) {
  // Si w poko kreye routes yo, pa gen pwoblèm; n ap kontinye ak / pou health check
  console.warn("Routes not loaded (optional):", e.message);
}

// Health check
app.get("/", (_req, res) => res.send("Church API up ✅"));

// Tès koneksyon ak DB + (opsyonèl) sync ak models yo
(async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ PostgreSQL connected successfully!");

    // Si tab yo deja la nan DB a, kenbe alter: false.
    await sequelize.sync({ alter: false }); 
  } catch (err) {
    console.error("❌ Database connection failed:", err.message);
  }
})();

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});

// Pi bon logs pou erè ki pa catch
process.on("unhandledRejection", (err) => console.error("Unhandled Rejection:", err));
process.on("uncaughtException", (err) => console.error("Uncaught Exception:", err));


 /*import User from "./models/User.js";

sequelize.sync({ alter: true })  // alter = modify existing table
  .then(() => console.log("✅ All models synced with database!"))
  .catch(err => console.error("❌ Sync failed:", err));*/
