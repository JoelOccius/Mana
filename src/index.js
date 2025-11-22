// server/src/index.js — CommonJS ONLY
/*require('dotenv').config();
const express   = require('express');
const cors      = require('cors');
const path      = require('path');
const fs        = require('fs');
const multer    = require('multer');        // ✅ CommonJS
const sequelize = require('./config/db');

// ====== ROUTES (ki deja egziste nan pwojè w) ======
const memberRoutes   = require('./routes/members');
const eventRoutes    = require('./routes/events');
const donationRoutes = require('./routes/donations');

// ⚠️ Otantifikasyon / admin / piblik (si yo egziste)
const authRoutes     = require('./routes/auth');
const adminRoutes    = require('./routes/admin');
const publicRoutes   = require('./routes/public');

const app = express();

/* ===================== MIDDLEWARES ===================== *
app.use(cors({
  origin: process.env.CLIENT_ORIGIN || 'http://localhost:5173', // ajiste si bezwen
  credentials: true,
}));
app.use(express.json()); // li JSON pou tout POST/PUT JSON

/* ==================== STATIC UPLOADS ==================== *
// Asire katab uploads la egziste
const uploadsDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });

// Sèvi fichye yo piblikman: http://localhost:5000/uploads/<filename>
app.use('/uploads', express.static(uploadsDir));

/* ==================== MULTER (UPLOAD) =================== *
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadsDir),
  filename: (_req, file, cb) => {
    const ext  = path.extname(file.originalname);
    const base = path.basename(file.originalname, ext).replace(/\s+/g, '_');
    cb(null, `${Date.now()}_${base}${ext}`);
  },
});
const upload = multer({ storage });

/* ===================== HEALTH CHECK ===================== *
app.get('/', (_req, res) => {
  // Toujou reponn JSON pou konsistans (evite HTML)
  return res.json({ ok: true, message: 'Church API up ✅' });
});

/* ================ SAMPLE POSTS ENDPOINTS =================
   Si ou DEJA gen routes pou posts nan pwojè w, ou ka
   retire seksyon sa yo. Men yo itil pou tès rapid ak frontend.
========================================================== */
// let POSTS = []; // memwa pou tès

// JSON: kreye post (lè w mete URL imaj)
/*app.post('/api/posts', (req, res) => {
  try {
    const { title, description, imageUrl } = req.body || {};
    if (!title) return res.status(400).json({ ok: false, message: 'title obligatwa' });

    const post = {
      id: Date.now().toString(),
      title,
      description: description || '',
      imageUrl: imageUrl || '',
      createdAt: new Date().toISOString(),
    };
    POSTS.unshift(post);
    return res.status(201).json({ ok: true, post });
  } catch (e) {
    return res.status(500).json({ ok: false, message: e.message });
  }
});

// MULTIPART: upload fichye (lè w chwazi imaj sou laptop)
app.post('/api/posts/upload', upload.single('image'), (req, res) => {
  try {
    const { title, description } = req.body || {};
    if (!title)      return res.status(400).json({ ok: false, message: 'title obligatwa' });
    if (!req.file)   return res.status(400).json({ ok: false, message: 'image obligatwa' });

    // URL piblik pou imaj la
    const publicUrl = `/uploads/${req.file.filename}`;

    const post = {
      id: Date.now().toString(),
      title,
      description: description || '',
      imageUrl: publicUrl,
      createdAt: new Date().toISOString(),
    };
    POSTS.unshift(post);
    return res.status(201).json({ ok: true, post });
  } catch (e) {
    return res.status(500).json({ ok: false, message: e.message });
  }
});

// Lis pou Home
app.get('/api/posts', (_req, res) => {
  return res.json({ ok: true, posts: POSTS });
});

/* ====================== YOUR ROUTES ===================== *
// API prensipal ou yo (Sequelize, Postgres, elatriye)
app.use('/api/members',   memberRoutes);
app.use('/api/events',    eventRoutes);
app.use('/api/donations', donationRoutes);

// otantifikasyon / admin / piblik
app.use('/auth',  authRoutes);
app.use('/admin', adminRoutes);
app.use('/public', publicRoutes);

/* ============== 404 JSON pou tout /api restan =========== *
app.use('/api', (_req, res) => {
  return res.status(404).json({ ok: false, message: 'Not found' });
});

/* ================== DB CONNECT & SYNC =================== *
(async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Connected to Postgres');
    await sequelize.sync({ alter: false });
    console.log('🗃️ Models synchronized');
  } catch (err) {
    console.error('❌ DB connection error:', err.message);
  }
})();

/* ===================== START SERVER ===================== *
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`API running on http://localhost:${PORT}`);
});

/* ==================== GLOBAL HANDLERS ==================== *
process.on('unhandledRejection', (err) => console.error('Unhandled Rejection:', err));
process.on('uncaughtException',  (err) => console.error('Uncaught Exception:', err));*/






/// server/src/index.js  — CommonJS
// server/src/index.js  — CommonJS, ready for Railway
/*require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const sequelize = require("./config/db");

// ====== ENSKRI MODÈL YO (pou Sequelize ka fè tablo yo) ======
require("./models/ContentBlock");
try { require("./models/User"); } catch {}
try { require("./models/Event"); } catch {}
try { require("./models/Announcement"); } catch {}

// ====== ROUTES ======
const memberRoutes   = require("./routes/members");
const eventRoutes    = require("./routes/events");
const donationRoutes = require("./routes/donations");
const authRoutes     = require("./routes/auth");
const adminRoutes    = require("./routes/admin");
const publicRoutes   = require("./routes/public");

const app = express();
app.set("trust proxy", 1);

// ====== CORS (localhost + Vercel previews) ======
const allowList = [
  process.env.FRONTEND_URL,     // eg. https://front.vercel.app
  process.env.ADMIN_URL,        // si gen admin separe
  "http://localhost:5173",
  "http://127.0.0.1:5173",
].filter(Boolean);

app.use(cors({
  origin: (origin, cb) => {
    if (!origin) return cb(null, true); // Postman/cURL
    const ok = allowList.includes(origin) || /\.vercel\.app$/i.test(origin);
    cb(null, ok);
  },
  credentials: true,
  methods: ["GET","POST","PUT","DELETE","OPTIONS"],
  allowedHeaders: ["Content-Type","Authorization"],
}));

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// ====== STATIC UPLOADS (rekòmande: server/src/uploads) ======
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ====== HEALTH ======
app.get("/health", (_req, res) => res.json({ ok: true, time: new Date().toISOString() }));
app.get("/", (_req, res) => res.send("Church API up ✅"));

// ====== MOUNT ROUTES ======
app.use("/api/members",   memberRoutes);
app.use("/api/events",    eventRoutes);
app.use("/api/donations", donationRoutes);
app.use("/auth",          authRoutes);
app.use("/admin",         adminRoutes);
app.use("/public",        publicRoutes);

// ====== 404 & ERROR HANDLERS ======
app.use((req, res) => {
  res.status(404).json({ error: `Route not found: ${req.method} ${req.originalUrl}` });
});
app.use((err, _req, res, _next) => {
  console.error("🔥 Error:", err);
  res.status(err.status || 500).json({ error: err.message || "Server error" });
});

// ====== DB CONNECT + SYNC ======
(async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ Connected to Postgres");
    await sequelize.sync({ alter: false });
    console.log("🗃️ Models synchronized");
  } catch (err) {
    console.error("❌ DB connection error:", err.message);
  }
})();

// ====== START SERVER ======
const PORT = process.env.PORT || 5000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`API running on :${PORT}`);
});

// ====== LOG UNHANDLED ======
process.on("unhandledRejection", (e)=>console.error("Unhandled Rejection:", e));
process.on("uncaughtException", (e)=>console.error("Uncaught Exception:", e));*/

// server/src/index.js
/*require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const sequelize = require("./config/db");

// ====== ENSKRI MODÈL YO (pou Sequelize ka fè tablo yo) ======
require("./models/ContentBlock");
try { require("./models/User"); } catch {}
try { require("./models/Event"); } catch {}
try { require("./models/Announcement"); } catch {}

// ====== ROUTES ======
const memberRoutes   = require("./routes/members");
const eventRoutes    = require("./routes/events");
const donationRoutes = require("./routes/donations");
const authRoutes     = require("./routes/auth");
const adminRoutes    = require("./routes/admin");
const publicRoutes   = require("./routes/public"); // <-- asire dosye sa egziste

const app = express();
app.set("trust proxy", 1);

// ====== CORS (localhost + Vercel previews) ======
const allowList = [
  process.env.FRONTEND_URL,     // eg. https://front.vercel.app
  process.env.ADMIN_URL,        // si gen admin separe
  "http://localhost:5173",
  "http://127.0.0.1:5173",
].filter(Boolean);

app.use(cors({
  origin: (origin, cb) => {
    if (!origin) return cb(null, true); // Postman/cURL
    const ok = allowList.includes(origin) || /\.vercel\.app$/i.test(origin);
    return cb(null, ok);
  },
  credentials: true,
  methods: ["GET","POST","PUT","DELETE","OPTIONS"],
  // pou evite erè preflight "cache-control not allowed"
  allowedHeaders: ["Content-Type","Authorization","Cache-Control"],
}));
app.options("*", cors());

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// ====== STATIC UPLOADS ======
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ====== HEALTH ======
app.get("/health", (_req, res) => res.json({ ok: true, time: new Date().toISOString() }));
app.get("/", (_req, res) => res.send("Church API up ✅"));

// ====== DEBUG ROUTES (ITIL POU DIAGNOSTIK) ======
app.get("/debug/models", (_req, res) => {
  const sequelize = require("./config/db");
  res.json(Object.keys(sequelize.models || {}));
});

// PROBE: li kontni dirèk san routes/public.js (izole pwoblèm rapid)
const ContentModelHotfix =
  sequelize.models.ContentBlock || sequelize.models.Content || null;

app.get("/public/content-probe", async (req, res) => {
  try {
    if (!ContentModelHotfix) return res.json([]);
    const page = (req.query.page || "home").toLowerCase();
    const rows = await ContentModelHotfix.findAll({
      where: { page },
      order: [["position", "ASC"], ["id", "ASC"]],
    });
    res.json(rows);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// ====== MOUNT ROUTES ======
app.use("/api/members",   memberRoutes);
app.use("/api/events",    eventRoutes);
app.use("/api/donations", donationRoutes);
app.use("/auth",          authRoutes);
app.use("/admin",         adminRoutes);
app.use("/public",        publicRoutes); // <- apre debug yo

// ====== 404 & ERROR HANDLERS ======
app.use((req, res) => {
  res.status(404).json({ error: `Route not found: ${req.method} ${req.originalUrl}` });
});
app.use((err, _req, res, _next) => {
  console.error("🔥 Error:", err);
  res.status(err.status || 500).json({ error: err.message || "Server error" });
});

// ====== DB CONNECT + SYNC ======
(async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ Connected to Postgres");
    await sequelize.sync({ alter: false });
    console.log("🗃️ Models synchronized");
  } catch (err) {
    console.error("❌ DB connection error:", err.message);
  }
})();

// ====== START SERVER ======
const PORT = process.env.PORT || 5000;
const HOST = process.env.HOST || "0.0.0.0"; // tande sou tout entèfas
const server = app.listen(PORT, HOST, () => {
  console.log(`API running on http://${HOST}:${PORT}`);
});
server.on("error", (err) => console.error("Server listen error:", err));

// ====== LOG UNHANDLED ======
process.on("unhandledRejection", (e)=>console.error("Unhandled Rejection:", e));
process.on("uncaughtException", (e)=>console.error("Uncaught Exception:", e));
*/

// server/src/index.js
require("dotenv").config();
console.log(">> src/index.js LOADED");

const express = require("express");
const cors = require("cors");
const path = require("path");

// ===== DB & MODELS (tout andedan src/) =====
const { sequelize, ContentBlock, ContentTranslation } = require("./models");

const memberRoutes   = require("./routes/members");
const eventRoutes    = require("./routes/events");
const donationRoutes = require("./routes/donations");
const authRoutes     = require("./routes/auth");
const adminRoutes    = require("./routes/admin");
const publicRoutes   = require("./routes/public");

const app = express();
app.set("trust proxy", 1);

// ===== CORS =====
const allowList = [
  process.env.FRONTEND_URL,
  process.env.ADMIN_URL,
  "http://localhost:5173",
  "http://127.0.0.1:5173",
].filter(Boolean);

app.use(cors({
  origin: (origin, cb) => {
    if (!origin) return cb(null, true); // Postman/cURL
    const ok = allowList.includes(origin) || /\.vercel\.app$/i.test(origin);
    cb(null, ok);
  },
  credentials: true,
  methods: ["GET","POST","PUT","DELETE","OPTIONS"],
  allowedHeaders: ["Content-Type","Authorization","Cache-Control"],
}));
app.options("*", cors());

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// ===== STATIC /uploads =====
// Si uploads yo anndan src/uploads:
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
// Si ou kenbe yo nan server/uploads (yon nivo anwo):
app.use("/uploads", express.static(path.join(__dirname, "..", "uploads")));

// ===== HEALTH =====
app.get("/health", (_req, res) => res.json({ ok: true, time: new Date().toISOString() }));
app.get("/", (_req, res) => res.send("Church API up ✅"));

// ===== DEBUG (anvan routes) =====
app.get("/debug/models", (_req, res) => {
  res.json(Object.keys(sequelize.models || {}));
});

// Tès rapid pou li blòk san tradiksyon
app.get("/public/content-probe", async (req, res) => {
  try {
    const page = (req.query.page || "home").toLowerCase();
    const rows = await ContentBlock.findAll({
      where: { page },
      order: [["position", "ASC"], ["id", "ASC"]],
    });
    res.json(rows);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// ===== ROUTES =====
app.use("/api/members",   memberRoutes);
app.use("/api/events",    eventRoutes);
app.use("/api/donations", donationRoutes);
app.use("/auth",          authRoutes);
app.use("/admin",         adminRoutes);
app.use("/public",        publicRoutes);

// ===== 404 & ERR =====
app.use((req, res) => {
  res.status(404).json({ error: `Route not found: ${req.method} ${req.originalUrl}` });
});
app.use((err, _req, res, _next) => {
  console.error("🔥 Error:", err);
  res.status(err.status || 500).json({ error: err.message || "Server error" });
});

// ===== DB CONNECT + SYNC =====
(async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ Connected to Postgres");
    await sequelize.sync({ alter: false });
    console.log("🗃️ Models synchronized");
  } catch (err) {
    console.error("❌ DB connection error:", err.message);
  }
})();

// ===== START =====
const PORT = process.env.PORT || 5050;
const HOST = process.env.HOST || "0.0.0.0";
const server = app.listen(PORT, HOST, () => {
  console.log(`API running on http://${HOST}:${PORT}`);
});
server.on("error", (err) => console.error("Server listen error:", err));

process.on("unhandledRejection", (e)=>console.error("Unhandled Rejection:", e));
process.on("uncaughtException", (e)=>console.error("Uncaught Exception:", e));









// server/src/index.js
/*require("dotenv").config();
console.log(">> index.js LOADED v1");
console.log(">> BOOT: index.js LOADED v2");
console.log(">> FILE:", __filename);
console.log(">> CWD :", process.cwd());

const express = require("express");
const cors = require("cors");
const path = require("path");
const sequelize = require("./config/db");

// ====== ENSKRI MODÈL YO ======
require("./models/ContentBlock");
try { require("./models/User"); } catch {}
try { require("./models/Event"); } catch {}
try { require("./models/Announcement"); } catch {}

// ====== ROUTES ======
const memberRoutes   = require("./routes/members");
const eventRoutes    = require("./routes/events");
const donationRoutes = require("./routes/donations");
const authRoutes     = require("./routes/auth");
const adminRoutes    = require("./routes/admin");
const publicRoutes   = require("./routes/public");

const app = express();
app.set("trust proxy", 1);

// ====== CORS ======
const allowList = [
  process.env.FRONTEND_URL,
  process.env.ADMIN_URL,
  "http://localhost:5173",
  "http://127.0.0.1:5173",
].filter(Boolean);

app.use(cors({
  origin: (origin, cb) => {
    if (!origin) return cb(null, true); // Postman/cURL
    const ok = allowList.includes(origin) || /\.vercel\.app$/i.test(origin);
    return cb(null, ok);
  },
  credentials: true,
  methods: ["GET","POST","PUT","DELETE","OPTIONS"],
  allowedHeaders: ["Content-Type","Authorization","Cache-Control"],
}));
app.options("*", cors());

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// ====== STATIC ======
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ====== HEALTH ======
app.get("/health", (_req, res) => res.json({ ok: true, time: new Date().toISOString() }));
app.get("/", (_req, res) => res.send("Church API up ✅"));

// ====== DEBUG & PROBE (ANVAN 404!) ======
app.get("/debug/models", (_req, res) => {
  const sequelize = require("./config/db");
  res.json(Object.keys(sequelize.models || {}));
});

const ContentModelHotfix =
  sequelize.models?.ContentBlock || sequelize.models?.Content || null;

app.get("/public/content-probe", async (req, res) => {
  try {
    if (!ContentModelHotfix) return res.json([]);
    const page = (req.query.page || "home").toLowerCase();
    const rows = await ContentModelHotfix.findAll({
      where: { page },
      order: [["position","ASC"], ["id","ASC"]],
    });
    res.json(rows);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// ====== MOUNT ROUTES (BEFORE 404) ======
app.use("/api/members",   memberRoutes);
app.use("/api/events",    eventRoutes);
app.use("/api/donations", donationRoutes);
app.use("/auth",          authRoutes);
app.use("/admin",         adminRoutes);
app.use("/public",        publicRoutes);


// ---- DEBUG: Afiche tout routes ki monte ----
function printRoutes(app) {
  console.log(">> ROUTES MOUNTED:");
  app._router.stack
    .filter(r => r.route || r.name === 'router')
    .forEach(layer => {
      if (layer.route) {
        const path = layer.route.path;
        const methods = Object.keys(layer.route.methods).join(",").toUpperCase();
        console.log(`   ${methods.padEnd(6)} ${path}`);
      } else if (layer.name === 'router' && layer.handle?.stack) {
        // middleware tankou app.use('/public', publicRoutes)
        const base = layer.regexp?.toString().replace(/^\/\^\\/, "/").replace(/\\\/\?\(\?=\\\/\|\$\)\/i$/, "") || "(base)";
        layer.handle.stack.forEach(subb => {
          if (subb.route) {
            const p = base + subb.route.path;
            const m = Object.keys(subb.route.methods).join(",").toUpperCase();
            console.log(`   ${m.padEnd(6)} ${p}`);
          }
        });
      }
    });
}


// ====== 404 & ERROR HANDLERS (ALWAYS LAST) ======
app.use((req, res) => {
  res.status(404).json({ error: `Route not found: ${req.method} ${req.originalUrl}` });
});
app.use((err, _req, res, _next) => {
  console.error("🔥 Error:", err);
  res.status(err.status || 500).json({ error: err.message || "Server error" });
});

// ====== DB CONNECT + SYNC ======
(async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ Connected to Postgres");
    await sequelize.sync({ alter: false });
    console.log("🗃️ Models synchronized");
  } catch (err) {
    console.error("❌ DB connection error:", err.message);
  }
})();

// ====== START SERVER ======
const PORT = process.env.PORT || 5000;
const HOST = process.env.HOST || "0.0.0.0";
const server = app.listen(PORT, HOST, () => {
  console.log(`API running on http://${HOST}:${PORT}`);
});
server.on("error", (err) => console.error("Server listen error:", err));

// ====== LOG UNHANDLED ======
process.on("unhandledRejection", (e)=>console.error("Unhandled Rejection:", e));
process.on("uncaughtException", (e)=>console.error("Uncaught Exception:", e));

await sequelize.sync({ alter: true });  // ← mete TRUE yon sèl demaraj pou ajoute kolòn lan
*/

// ... tout sa w te genyen pi wo yo rete menm jan ...

// ====== DB CONNECT + SYNC ======
// ====== ENV & BOOT LOGS ======
/*require("dotenv").config();
console.log(">> index.js LOADED v1");
console.log(">> BOOT: index.js LOADED v2");
console.log(">> FILE:", __filename);
console.log(">> CWD :", process.cwd());

// ====== IMPORTS (CommonJS) ======
const express   = require("express");
const cors      = require("cors");
const path      = require("path");
const sequelize = require("./config/db");*/

// ====== ROUTES ======
/*const memberRoutesRaw   = require("./routes/members");
const eventRoutesRaw    = require("./routes/events");
const donationRoutesRaw = require("./routes/donations");
const authRoutesRaw     = require("./routes/auth");
const adminRoutesRaw    = require("./routes/admin");
const publicRoutesRaw   = require("./routes/public");

// si fichye a te fè `export default`, pran `.default`; sinon pran valè a dirèk
const memberRoutes   = memberRoutesRaw.default   || memberRoutesRaw;
const eventRoutes    = eventRoutesRaw.default    || eventRoutesRaw;
const donationRoutes = donationRoutesRaw.default || donationRoutesRaw;
const authRoutes     = authRoutesRaw.default     || authRoutesRaw;
const adminRoutes    = adminRoutesRaw.default    || adminRoutesRaw;
const publicRoutes   = publicRoutesRaw.default   || publicRoutesRaw;



// ====== REGISTER MODELS BEFORE SYNC ======
require("./models/ContentBlock");
try { require("./models/User"); } catch {}
try { require("./models/Event"); } catch {}
try { require("./models/Announcement"); } catch {}

// ====== ROUTES ======
const memberRoutes   = require("./routes/members");
const eventRoutes    = require("./routes/events");
const donationRoutes = require("./routes/donations");
const authRoutes     = require("./routes/auth");
const adminRoutes    = require("./routes/admin");
const publicRoutes   = require("./routes/public");

// ====== APP INIT ======
const app = express();
app.set("trust proxy", 1);

// ====== CORS ======
const allowList = [
  process.env.FRONTEND_URL,
  process.env.ADMIN_URL,
  "http://localhost:5173",
  "http://127.0.0.1:5173",
].filter(Boolean);

app.use(
  cors({
    origin: (origin, cb) => {
      if (!origin) return cb(null, true); // Postman/cURL/Server-to-Server
      const ok = allowList.includes(origin) || /\.vercel\.app$/i.test(origin);
      if (ok) return cb(null, true);
      return cb(new Error(`CORS blocked for origin: ${origin}`), false);
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "Cache-Control"],
  })
);
app.options("*", cors());

// ====== BODY PARSERS ======
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// ====== STATIC ======
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ====== HEALTH ======
app.get("/health", (_req, res) =>
  res.json({ ok: true, time: new Date().toISOString() })
);
app.get("/", (_req, res) => res.send("Church API up ✅"));

// ====== DEBUG & PROBE (BEFORE 404) ======
app.get("/debug/models", (_req, res) => {
  res.json(Object.keys(sequelize.models || {}));
});

// Probe pou kontni piblik (san auth)
app.get("/public/content-probe", async (req, res) => {
  try {
    // pran dènye referans modèl la (evite cache variable)
    const ContentModel =
      sequelize.models?.ContentBlock || sequelize.models?.Content || null;

    if (!ContentModel) return res.json([]);

    const page = (req.query.page || "home").toLowerCase();
    const rows = await ContentModel.findAll({
      where: { page },
      order: [
        ["position", "ASC"],
        ["id", "ASC"],
      ],
    });
    res.json(rows);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// ====== MOUNT ROUTES (BEFORE 404) ======
app.use("/api/members",   memberRoutes);
app.use("/api/events",    eventRoutes);
app.use("/api/donations", donationRoutes);
app.use("/auth",          authRoutes);
app.use("/admin",         adminRoutes);
app.use("/public",        publicRoutes);

// ---- DEBUG: Afiche tout routes ki monte ----
function printRoutes(appInstance) {
  console.log(">> ROUTES MOUNTED:");
  appInstance._router.stack
    .filter((r) => r.route || r.name === "router")
    .forEach((layer) => {
      if (layer.route) {
        const p = layer.route.path;
        const m = Object.keys(layer.route.methods).join(",").toUpperCase();
        console.log(`   ${m.padEnd(6)} ${p}`);
      } else if (layer.name === "router" && layer.handle?.stack) {
        const base =
          layer.regexp
            ?.toString()
            .replace(/^\/\^\\/, "/")
            .replace(/\\\/\?\(\?=\\\/\|\$\)\/i$/, "") || "(base)";
        layer.handle.stack.forEach((subb) => {
          if (subb.route) {
            const p = base + subb.route.path;
            const m = Object.keys(subb.route.methods).join(",").toUpperCase();
            console.log(`   ${m.padEnd(6)} ${p}`);
          }
        });
      }
    });
}
printRoutes(app);

// ====== 404 & ERROR HANDLERS (ALWAYS LAST) ======
app.use((req, res) => {
  res
    .status(404)
    .json({ error: `Route not found: ${req.method} ${req.originalUrl}` });
});
app.use((err, _req, res, _next) => {
  console.error("🔥 Error:", err);
  res.status(err.status || 500).json({ error: err.message || "Server error" });
});

// ====== DB CONNECT + SYNC (NO TOP-LEVEL await) ======
(async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ Connected to Postgres");

    // ⚠️ Si w bezwen ajoute kolòn otomatik yon sèl fwa:
    // chanje tanporèman alter: true, kouri API a, verifye,
    // epi mete l tounen alter: false pou itilizasyon nòmal.
    // await sequelize.sync({ alter: true });
    await sequelize.sync({ alter: false });


    console.log("🗃️ Models synchronized");
  } catch (err) {
    console.error("❌ DB connection error:", err.message);
  }
})();

// ====== START SERVER ======
const PORT = process.env.PORT || 5000;
const HOST = process.env.HOST || "0.0.0.0";
const server = app.listen(PORT, HOST, () => {
  console.log(`API running on http://${HOST}:${PORT}`);
});
server.on("error", (err) => console.error("Server listen error:", err));

// ====== LOG UNHANDLED ======
process.on("unhandledRejection", (e) =>
  console.error("Unhandled Rejection:", e)
);
process.on("uncaughtException", (e) =>
  console.error("Uncaught Exception:", e)
);

// ⚠️ ENPÒTAN: Pa mete okenn `await` anba a (pa gen top-level await nan CommonJS)

/*require("dotenv").config();
console.log(">> index.js LOADED v1");
console.log(">> BOOT: index.js LOADED v2");
console.log(">> FILE:", __filename);
console.log(">> CWD :", process.cwd());

// ====== IMPORTS (CommonJS) ======
const express   = require("express");
const cors      = require("cors");
const path      = require("path");
const sequelize = require("./config/db");

// ====== APP INIT ======
const app = express();                 // ← defini YON SÈL fwa
app.set("sequelize", sequelize);       // ← mete apre app la ekziste
app.set("trust proxy", 1);

// ====== REGISTER MODELS BEFORE SYNC ======
require("./models/ContentBlock");
require("./models/ContentTranslation");
try { require("./models/User"); } catch {}
try { require("./models/Event"); } catch {}
try { require("./models/Announcement"); } catch {}

// ====== ROUTES ======
const memberRoutes   = require("./routes/members");
const eventRoutes    = require("./routes/events");
const donationRoutes = require("./routes/donations");
const authRoutes     = require("./routes/auth");
const adminRoutes    = require("./routes/admin");
const publicRoutes   = require("./routes/public");

// ====== CORS ======
const allowList = [
  process.env.FRONTEND_URL,
  process.env.ADMIN_URL,
  "http://localhost:5173",
  "http://127.0.0.1:5173",
].filter(Boolean);

app.use(cors({
  origin: (origin, cb) => {
    if (!origin) return cb(null, true); // Postman/cURL/Server-to-Server
    const ok = allowList.includes(origin) || /\.vercel\.app$/i.test(origin);
    if (ok) return cb(null, true);
    return cb(new Error(`CORS blocked for origin: ${origin}`), false);
  },
  credentials: true,
  methods: ["GET","POST","PUT","DELETE","OPTIONS"],
  allowedHeaders: ["Content-Type","Authorization","Cache-Control"],
}));
app.options("*", cors());

// ====== BODY PARSERS ======
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// ====== STATIC ======
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ====== HEALTH ======
app.get("/health", (_req, res) => res.json({ ok: true, time: new Date().toISOString() }));
app.get("/", (_req, res) => res.send("Church API up ✅"));

// ====== DEBUG & PROBE (BEFORE 404) ======
app.get("/debug/models", (_req, res) => {
  res.json(Object.keys(sequelize.models || {}));
});
app.get("/public/content-probe", async (req, res) => {
  try {
    const ContentModel = sequelize.models?.ContentBlock || sequelize.models?.Content || null;
    if (!ContentModel) return res.json([]);
    const page = (req.query.page || "home").toLowerCase();
    const rows = await ContentModel.findAll({
      where: { page },
      order: [["position","ASC"], ["id","ASC"]],
    });
    res.json(rows);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// ====== MOUNT ROUTES (BEFORE 404) ======
app.use("/api/members",   memberRoutes);
app.use("/api/events",    eventRoutes);
app.use("/api/donations", donationRoutes);
app.use("/auth",          authRoutes);
app.use("/admin",         adminRoutes);
app.use("/public",        publicRoutes);

// ---- DEBUG: Afiche tout routes ki monte ----
function printRoutes(appInstance) {
  console.log(">> ROUTES MOUNTED:");
  appInstance._router.stack
    .filter(r => r.route || r.name === "router")
    .forEach(layer => {
      if (layer.route) {
        const p = layer.route.path;
        const m = Object.keys(layer.route.methods).join(",").toUpperCase();
        console.log(`   ${m.padEnd(6)} ${p}`);
      } else if (layer.name === "router" && layer.handle?.stack) {
        const base = layer.regexp?.toString()
          .replace(/^\/\^\\/, "/")
          .replace(/\\\/\?\(\?=\\\/\|\$\)\/i$/, "") || "(base)";
        layer.handle.stack.forEach(subb => {
          if (subb.route) {
            const p = base + subb.route.path;
            const m = Object.keys(subb.route.methods).join(",").toUpperCase();
            console.log(`   ${m.padEnd(6)} ${p}`);
          }
        });
      }
    });
}
printRoutes(app);

// ====== 404 & ERROR HANDLERS (ALWAYS LAST) ======
app.use((req, res) => {
  res.status(404).json({ error: `Route not found: ${req.method} ${req.originalUrl}` });
});
app.use((err, _req, res, _next) => {
  console.error("🔥 Error:", err);
  res.status(err.status || 500).json({ error: err.message || "Server error" });
});

// ====== DB CONNECT + SYNC (NO TOP-LEVEL await) ======
(async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ Connected to Postgres");
    // Si w bezwen alter yon sèl fwa: await sequelize.sync({ alter: true });
    await sequelize.sync({ alter: false });
    console.log("🗃️ Models synchronized");
  } catch (err) {
    console.error("❌ DB connection error:", err.message);
  }
})();

// ====== START SERVER ======
const PORT = process.env.PORT || 5050;   // ← mete PORT=5050 nan .env si ou vle
const HOST = process.env.HOST || "0.0.0.0";
const server = app.listen(PORT, HOST, () => {
  console.log(`API running on http://${HOST}:${PORT}`);
});
server.on("error", (err) => console.error("Server listen error:", err));

// ====== LOG UNHANDLED ======
process.on("unhandledRejection", (e)=>console.error("Unhandled Rejection:", e));
process.on("uncaughtException", (e)=>console.error("Uncaught Exception:", e));*/

// ⚠️ Pa gen top-level await anba a.

/*require("dotenv").config();
console.log(">> index.js LOADED");
console.log(">> FILE:", __filename);
console.log(">> CWD :", process.cwd());

/* ================== IMPORTS ================== *
const express   = require("express");
const cors      = require("cors");
const path      = require("path");
const sequelize = require("./config/db");

/* ================== APP ================== *
const app = express();
app.set("trust proxy", 1);
app.set("sequelize", sequelize);

/* ================== REGISTER MODELS BEFORE SYNC ================== *
require("./models/ContentBlock");
try { require("./models/User"); } catch {}
try { require("./models/Event"); } catch {}
try { require("./models/Announcement"); } catch {}
try { require("./models/ContentTranslation"); } catch {} // ok si pa egziste

/* ================== ROUTES (unwrap .default si ESM) ================== *
function unwrap(m) { return m && (m.default || m); }

const memberRoutes    = unwrap(require("./routes/members"));
const eventRoutes     = unwrap(require("./routes/events"));
const donationRoutes  = unwrap(require("./routes/donations"));
const authRoutes      = unwrap(require("./routes/auth"));
const adminRoutes     = unwrap(require("./routes/admin"));
const publicRoutes    = unwrap(require("./routes/public"));

/* ================== CORS ================== */
/*const allowList = [
  process.env.FRONTEND_URL,
  process.env.ADMIN_URL,
  "http://localhost:5173",
  "http://127.0.0.1:5173",
].filter(Boolean);

app.use(cors({
  origin: (origin, cb) => {
    if (!origin) return cb(null, true); // Postman/cURL
    const ok = allowList.includes(origin) || /\.vercel\.app$/i.test(origin);
    return cb(null, ok);
  },
  credentials: true,
  methods: ["GET","POST","PUT","DELETE","OPTIONS"],
  allowedHeaders: ["Content-Type","Authorization","Cache-Control"],
}));
app.options("*", cors());

/* ================== BODY PARSERS ================== *
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

/* ================== STATIC ================== *
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

/* ================== HEALTH ================== *
app.get("/health", (_req, res) => res.json({ ok: true, time: new Date().toISOString() }));
app.get("/", (_req, res) => res.send("Church API up ✅"));

/* ================== DEBUG (BEFORE 404) ================== *
app.get("/debug/models", (_req, res) => {
  res.json(Object.keys(sequelize.models || {}));
});

/* ================== MOUNT ROUTES ================== *
app.use("/api/members",   memberRoutes);
app.use("/api/events",    eventRoutes);
app.use("/api/donations", donationRoutes);
app.use("/auth",          authRoutes);
app.use("/admin",         adminRoutes);
app.use("/public",        publicRoutes);

/* (Opsyonèl) Afiche tout routes ki monte *
function printRoutes(appInstance) {
  console.log(">> ROUTES MOUNTED:");
  if (!appInstance._router) return;
  appInstance._router.stack
    .filter(r => r.route || r.name === "router")
    .forEach(layer => {
      if (layer.route) {
        const p = layer.route.path;
        const m = Object.keys(layer.route.methods).join(",").toUpperCase();
        console.log(`   ${m.padEnd(6)} ${p}`);
      } else if (layer.name === "router" && layer.handle?.stack) {
        const base = layer.regexp?.toString()
          .replace(/^\/\^\\/, "/")
          .replace(/\\\/\?\(\?=\\\/\|\$\)\/i$/, "") || "(base)";
        layer.handle.stack.forEach(subb => {
          if (subb.route) {
            const p = base + subb.route.path;
            const m = Object.keys(subb.route.methods).join(",").toUpperCase();
            console.log(`   ${m.padEnd(6)} ${p}`);
          }
        });
      }
    });
}
printRoutes(app);

/* ================== 404 & ERROR HANDLERS ================== *
app.use((req, res) => {
  res.status(404).json({ error: `Route not found: ${req.method} ${req.originalUrl}` });
});
app.use((err, _req, res, _next) => {
  console.error("🔥 Error:", err);
  res.status(err.status || 500).json({ error: err.message || "Server error" });
});

/* ================== DB CONNECT + SYNC ================== *
(async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ Connected to Postgres");
    await sequelize.sync({ alter: false }); // pa mete top-level await pi ba
    console.log("🗃️ Models synchronized");
  } catch (err) {
    console.error("❌ DB connection error:", err.message);
  }
})();

/* ================== START SERVER ================== *
const PORT = process.env.PORT || 5050;
const HOST = process.env.HOST || "0.0.0.0";
const server = app.listen(PORT, HOST, () => {
  console.log(`API running on http://${HOST}:${PORT}`);
});
server.on("error", (err) => console.error("Server listen error:", err));

/* ================== LOG UNHANDLED ================== *
process.on("unhandledRejection", (e)=>console.error("Unhandled Rejection:", e));
process.on("uncaughtException", (e)=>console.error("Uncaught Exception:", e));

/* ⚠️ Pa gen okenn redeklarasyon 'app' oswa 'memberRoutes' anba a */


