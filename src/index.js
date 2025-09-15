/*require("dotenv").config();
const express = require("express");
const cors = require("cors");
const sequelize = require("./config/db");

// IMPORT ROUTES
const memberRoutes = require("./routes/members");
const eventRoutes = require("./routes/events");
const donationRoutes = require("./routes/donations");

const app = express();
app.use(cors());
app.use(express.json());

// health
app.get("/", (_req, res) => res.send("Church API up ✅"));

// USE ROUTES
app.use("/api/members", memberRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/donations", donationRoutes);

// DB connect test + (opsyonèl) sync ak tab ki deja egziste
(async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ Connected to Postgres");

    // Si tab yo **deja** egziste nan DB (jan ou te kreye yo), kenbe FALSE:
    await sequelize.sync({ alter: false });

  } catch (err) {
    console.error("❌ DB connection error:", err.message);
  }
})();

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`API running on http://localhost:${PORT}`));

process.on("unhandledRejection", err => console.error("Unhandled Rejection:", err));
process.on("uncaughtException", err => console.error("Uncaught Exception:", err));*/

require("dotenv").config();
const express = require("express");
const cors = require("cors");
const sequelize = require("./config/db");

// IMPORT ROUTES
const memberRoutes = require("./routes/members");
const eventRoutes = require("./routes/events");
const donationRoutes = require("./routes/donations");

const app = express();
app.use(cors());
app.use(express.json());

// health
app.get("/", (_req, res) => res.send("Church API up ✅"));

// USE ROUTES
app.use("/api/members", memberRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/donations", donationRoutes);

// DB connect test + (opsyonèl) sync ak tab ki deja egziste
(async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ Connected to Postgres");

    // Si tab yo **deja** egziste nan DB (jan ou te kreye yo), kenbe FALSE:
    await sequelize.sync({ alter: false });

  } catch (err) {
    console.error("❌ DB connection error:", err.message);
  }
})();

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`API running on http://localhost:${PORT}`));

process.on("unhandledRejection", err => console.error("Unhandled Rejection:", err));
process.on("uncaughtException", err => console.error("Uncaught Exception:", err));


