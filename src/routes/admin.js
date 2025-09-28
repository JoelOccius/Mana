// server/src/routes/admin.js
const express = require("express");
const router = express.Router();
const path = require("path");
const fs = require("fs");
const multer = require("multer");

const ContentBlock = require("../models/ContentBlock");

console.log("✅ /admin routes loaded");

// ------- UPLOAD (field name: "file") -------
const uploadDir = path.join(__dirname, "..", "..", "uploads"); // => server/uploads
// ✅ Asire katab la egziste
fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadDir),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname || "");
    const name = Date.now() + "-" + Math.round(Math.random() * 1e9) + ext;
    cb(null, name);
  },
});

// (opsyonèl) limite kalite fichye yo ak gwòs yo
const upload = multer({
  storage,
  fileFilter: (_req, file, cb) => {
    // aksepte imaj & videyo sèlman
    if (/^(image|video)\//.test(file.mimetype)) return cb(null, true);
    cb(new Error("Only image/video files are allowed"));
  },
  limits: { fileSize: 20 * 1024 * 1024 }, // 20MB
});

// Tès sante / chemen uploads
router.get("/health", (_req, res) => res.json({ ok: true }));
router.get("/where-uploads", (_req, res) => res.json({ uploadDir }));

// POST /admin/upload
router.post("/upload", upload.single("file"), (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "No file uploaded" });

    // eg. http://localhost:5000
    const base = process.env.APP_BASE_URL || `${req.protocol}://${req.get("host")}`;
    const relative = `/uploads/${req.file.filename}`;
    const absolute = `${base}${relative}`;

    return res.json({
      url: absolute,  // pou <img src="...">
      path: relative, // si w pito sove relatif nan DB
      filename: req.file.filename,
      size: req.file.size,
      mimetype: req.file.mimetype,
    });
  } catch (e) {
    console.error("Upload error:", e);
    return res.status(500).json({ error: e.message || "Upload failed" });
  }
});

// ------- CONTENT CRUD -------

// POST /admin/content
router.post("/content", async (req, res) => {
  try {
    const {
      page, slot = "body", type = "text",
      title, body, media_url, position = 0, is_active = true
    } = req.body;

    if (!page) return res.status(400).json({ error: "page is required" });

    const row = await ContentBlock.create({
      page, slot, type, title, body, media_url, position, is_active
    });
    res.json(row);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// PUT /admin/content/:id
router.put("/content/:id", async (req, res) => {
  try {
    const row = await ContentBlock.findByPk(req.params.id);
    if (!row) return res.status(404).json({ error: "Content not found" });

    const { page, slot, type, title, body, media_url, position, is_active } = req.body;
    await row.update({
      page:      page      ?? row.page,
      slot:      slot      ?? row.slot,
      type:      type      ?? row.type,
      title:     title     ?? row.title,
      body:      body      ?? row.body,
      media_url: media_url ?? row.media_url,
      position:  (typeof position === "number" ? position : row.position),
      is_active: (typeof is_active === "boolean" ? is_active : row.is_active),
    });
    res.json(row);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// DELETE /admin/content/:id
router.delete("/content/:id", async (req, res) => {
  try {
    const row = await ContentBlock.findByPk(req.params.id);
    if (!row) return res.status(404).json({ error: "Content not found" });
    await row.destroy();
    res.json({ ok: true });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

module.exports = router;

