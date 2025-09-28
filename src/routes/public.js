/* 




*/



// server/src/routes/public.js
const express = require("express");
const router = express.Router();

// (Opsyonèl) Anons — si modèl la pa egziste, nou degrade san kraze
let Announcement = null;
try { Announcement = require("../models/Announcement"); } catch (_) {}

/** 💡 Chwazi modèl kontni an:
 *  Si ou gen ContentBlock, nou itilize li.
 *  Sinon, si ou te swiv patch "Content.js", chanje require a anba a.
 */
let ContentModel = null;
try {
  ContentModel = require("../models/ContentBlock");   // <- modèl ou te deja itilize
} catch (_) {
  try { ContentModel = require("../models/Content"); } // <- fallback si ou te kreye Content.js
  catch (e) {
    console.error("❌ Pa jwenn modèl kontni an (ContentBlock/Content).");
  }
}

/* =========================
   ANNOUNCEMENT (piblik)
   ========================= */
router.get("/announcement", async (_req, res) => {
  try {
    if (!Announcement) {
      // Pa gen modèl la: retounen vid
      return res.json({ text: "", is_active: false });
    }
    const a = await Announcement.findOne({ order: [["updated_at", "DESC"]] });
    res.json(a || { text: "", is_active: false });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

/* =========================
   HEADER SCROLL (senp)
   GET /public/header-scroll?page=home
   ========================= */
router.get("/header-scroll", async (req, res) => {
  try {
    if (!ContentModel) return res.status(500).json({ error: "Content model missing" });

    const page = req.query.page || "home";
    const rows = await ContentModel.findAll({
      where: { page },
      order: [["position", "ASC"], ["id", "ASC"]],
    });

    // chèche yon blòk header oswa title "scroll"
    const first = (rows || []).find((r) => {
      const raw = r.toJSON ? r.toJSON() : r;
      const slot  = (raw.slot || "").toLowerCase();
      const title = (raw.title || "").toLowerCase();
      return slot === "header" || title === "scroll";
    });

    if (!first) return res.json({ text: "", is_active: false });

    const raw = first.toJSON ? first.toJSON() : first;
    return res.json({
      id: raw.id,
      text: raw.body || "",
      is_active: raw.is_active !== undefined ? !!raw.is_active : true,
      updated_at: raw.updated_at || raw.updatedAt || null,
    });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

/* =========================
   BODY/ALL CONTENT (piblik)
   GET /public/content?page=home[&slot=body|header|footer|all]
   ========================= */
router.get("/content", async (req, res) => {
  try {
    if (!ContentModel) return res.status(500).json({ error: "Content model missing" });

    const page = req.query.page || "home";
    const slot = (req.query.slot || "").toLowerCase(); // "body" | "header" | "footer" | "all"/""

    const where = { page };
    if (slot && slot !== "all") {
      // si yo mande yon slot espesifik, filtre sou li
      where.slot = slot;
    }
    // Nòt: si w gen chan is_active sou modèl la epi ou vle filtre sèlman aktif:
    // where.is_active = true;

    const rows = await ContentModel.findAll({
      where,
      order: [["position", "ASC"], ["id", "ASC"]],
    });

    // Normalize pou front lan
    const list = (rows || []).map((r) => {
      const raw = r.toJSON ? r.toJSON() : r;

      const body =
        raw.body ??
        raw.content ??
        raw.description ??
        ""; // pran premye ki egziste

      const media_url =
        raw.media_url ??
        raw.mediaUrl ??
        raw.url ??
        raw.src ??
        null;

      const type = (raw.type || "").toLowerCase(); // "text" | "image" | "video" | "html"
      const slotName = (raw.slot || "").toLowerCase();

      return {
        id: raw.id,
        page: raw.page || page,
        slot: slotName || "body",
        title: raw.title || "",
        type,
        body,
        media_url,
        position: raw.position ?? 0,
        is_active: raw.is_active !== undefined ? !!raw.is_active : true,
      };
    });

    res.json(list);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

module.exports = router;
