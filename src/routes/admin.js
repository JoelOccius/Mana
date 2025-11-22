// server/src/routes/admin.js
const express = require("express");
const router = express.Router();
const path = require("path");
const fs = require("fs");
const multer = require("multer");

// ⚠️ pran modèl yo depi ../models pou include/associations mache
const { ContentBlock, ContentTranslation } = require("../models");

console.log("✅ /admin routes loaded");

/* ---------------------- UPLOAD ---------------------- */
const uploadDir = path.join(__dirname, "..", "..", "uploads");
fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadDir),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname || "");
    const name = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
    cb(null, name);
  },
});

const upload = multer({
  storage,
  fileFilter: (_req, file, cb) => {
    if (/^(image|video)\//.test(file.mimetype)) return cb(null, true);
    cb(new Error("Only image/video files are allowed"));
  },
  limits: { fileSize: 20 * 1024 * 1024 },
});

// middleware pou atrap erè multer yo byen
function multerErrorHandler(err, _req, res, _next) {
  if (err instanceof multer.MulterError || err?.message?.includes("Only image/video")) {
    return res.status(400).json({ error: err.message });
  }
  return res.status(500).json({ error: err.message || "Upload failed" });
}

router.get("/health", (_req, res) => res.json({ ok: true }));
router.get("/where-uploads", (_req, res) => res.json({ uploadDir }));

router.post("/upload", upload.single("file"), (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "No file uploaded" });
    const base = process.env.APP_BASE_URL || `${req.protocol}://${req.get("host")}`;
    const relative = `/uploads/${req.file.filename}`;
    const absolute = `${base}${relative}`;
    return res.json({
      url: absolute,
      path: relative,
      filename: req.file.filename,
      size: req.file.size,
      mimetype: req.file.mimetype,
    });
  } catch (e) {
    console.error("Upload error:", e);
    return res.status(500).json({ error: e.message || "Upload failed" });
  }
}, multerErrorHandler);

/* ---------------------- CONTENT CRUD ---------------------- */

/**
 * ADMIN LIST:
 * - default: TOUT (enkli soft-deleted) gras ak scope('withDeleted')
 * - ?onlyActive=true → sèlman ki aktif e pa efase
 * - ?page=home → filtre pa paj
 */
router.get("/content", async (req, res) => {
  try {
    const { page, onlyActive } = req.query;
    const useOnlyActive = String(onlyActive || "").toLowerCase() === "true";

    const where = {
      ...(page ? { page: String(page).toLowerCase() } : {}),
      ...(useOnlyActive ? { is_active: true } : {}),
    };

    const finder = useOnlyActive
      ? ContentBlock.findAll({
          where,
          order: [["updated_at", "DESC"], ["id", "DESC"]],
          include: [{ model: ContentTranslation, as: "translations", required: false }],
        })
      : ContentBlock.scope("withDeleted").findAll({
          where,
          order: [["updated_at", "DESC"], ["id", "DESC"]],
          include: [{ model: ContentTranslation, as: "translations", required: false }],
        });

    const items = await finder;
    return res.json(items);
  } catch (e) {
    console.error("GET /admin/content error:", e);
    res.status(500).json({ error: e.message });
  }
});

// CREATE
router.post("/content", async (req, res) => {
  try {
    const {
      page,
      slot = "body",
      type = "text",
      title,
      body,
      media_url,
      position = 0,
      is_active = true,
    } = req.body;

    if (!page) return res.status(400).json({ error: "page is required" });

    const row = await ContentBlock.create({
      page,
      slot,
      type,
      title,
      body,
      media_url,
      position,
      is_active,
    });
    res.status(201).json(row);
  } catch (e) {
    console.error("POST /admin/content error:", e);
    res.status(500).json({ error: e.message });
  }
});

// UPDATE
router.put("/content/:id", async (req, res) => {
  try {
    const row = await ContentBlock.scope("withDeleted").findByPk(req.params.id);
    if (!row) return res.status(404).json({ error: "Content not found" });

    const { page, slot, type, title, body, media_url, position, is_active } = req.body;
    await row.update({
      page: page ?? row.page,
      slot: slot ?? row.slot,
      type: type ?? row.type,
      title: title ?? row.title,
      body: body ?? row.body,
      media_url: media_url ?? row.media_url,
      position: typeof position === "number" ? position : row.position,
      is_active: typeof is_active === "boolean" ? is_active : row.is_active,
    });
    res.json(row);
  } catch (e) {
    console.error("PUT /admin/content/:id error:", e);
    res.status(500).json({ error: e.message });
  }
});

// SOFT DELETE
router.delete("/content/:id", async (req, res) => {
  try {
    const count = await ContentBlock.destroy({ where: { id: req.params.id } }); // paranoid
    if (!count) return res.status(404).json({ error: "Content not found" });
    return res.status(204).send();
  } catch (e) {
    console.error("DELETE /admin/content/:id error:", e);
    res.status(500).json({ error: e.message });
  }
});

// TOGGLE ACTIVE
router.patch("/content/:id/active", async (req, res) => {
  try {
    const { is_active } = req.body;
    const row = await ContentBlock.scope("withDeleted").findByPk(req.params.id);
    if (!row) return res.status(404).json({ error: "Content not found" });
    row.is_active = !!is_active;
    await row.save();
    res.json(row);
  } catch (e) {
    console.error("PATCH /admin/content/:id/active error:", e);
    res.status(500).json({ error: e.message });
  }
});

// RESTORE
router.patch("/content/:id/restore", async (req, res) => {
  try {
    const row = await ContentBlock.scope("withDeleted").findByPk(req.params.id);
    if (!row) return res.status(404).json({ error: "Content not found" });
    await row.restore();
    res.json(row);
  } catch (e) {
    console.error("PATCH /admin/content/:id/restore error:", e);
    res.status(500).json({ error: e.message });
  }
});

module.exports = router;
