// // server/src/routes/public.js
const express = require("express");
const { Op } = require("sequelize");
const router = express.Router();

// ✅ pran modèl yo depi index (asosyasyon yo deja mare)
const { ContentBlock, ContentTranslation } = require("../models");

/* -------- Anti-cache pou repons dinamik -------- */
router.use((_req, res, next) => {
  res.set("Cache-Control", "no-store, must-revalidate");
  res.set("Pragma", "no-cache");
  res.set("Expires", "0");
  next();
});

/* -------- ANNOUNCEMENT (optional) -------- */
let Announcement = null;
try { Announcement = require("../models/Announcement"); } catch (_) {}

router.get("/announcement", async (_req, res) => {
  try {
    if (!Announcement) return res.json({ text: "", is_active: false });
    const a = await Announcement.findOne({ order: [["updated_at", "DESC"]] });
    res.json(a || { text: "", is_active: false });
  } catch (e) {
    console.error("public/announcement error:", e);
    res.status(500).json({ ok: false, error: e.message });
  }
});

/* -------- HEADER SCROLL -------- */
router.get("/header-scroll", async (req, res) => {
  try {
    const page = String(req.query.page || "home").toLowerCase();

    const rows = await ContentBlock.findAll({
      where: { page, is_active: true },
      order: [["position", "ASC"], ["id", "ASC"]],
    });

    const first = (rows || []).find((r) => {
      const raw = r.toJSON ? r.toJSON() : r;
      const slot  = String(raw.slot || "").toLowerCase();
      const title = String(raw.title || "").toLowerCase();
      return slot === "header" || title === "scroll";
    });

    if (!first) return res.json({ id: null, text: "", is_active: false });

    const raw = first.toJSON ? first.toJSON() : first;
    return res.json({
      id: raw.id,
      text: raw.body || "",
      is_active: raw.is_active !== undefined ? !!raw.is_active : true,
      updated_at: raw.updated_at || raw.updatedAt || null,
    });
  } catch (e) {
    console.error("public/header-scroll error:", e);
    res.status(500).json({ ok: false, error: e.message });
  }
});

/* -------- PUBLIC CONTENT (Tradiksyon via content_translations) -------- */
router.get("/content", async (req, res) => {
  const page        = String(req.query.page || "home").toLowerCase();
  const requested   = String(req.query.lang || "").trim().toLowerCase(); // eg. 'pt-br'
  const wantedLangs = requested ? [requested, requested.split("-")[0]] : [];

  // helper ki fè map + fallback tradiksyon
  const mapWithTranslations = (rows) => {
    return rows.map((r) => {
      const o = r.toJSON ? r.toJSON() : r;
      const trList = Array.isArray(o.translations) ? o.translations : [];
      const pick =
        wantedLangs.length
          ? (trList.find(t => t.lang === wantedLangs[0]) ||
             trList.find(t => t.lang === wantedLangs[1]) ||
             trList[0])
          : trList[0];

      return {
        id:        o.id,
        page:      o.page,
        slot:      o.slot,
        type:      o.type,
        title:     pick?.title ?? o.title,
        body:      pick?.body  ?? o.body,
        media_url: o.media_url,
        position:  o.position,
        is_active: o.is_active,
        // debug itil
        lang_base: o.lang || null,
        lang_used: pick?.lang || null,
      };
    });
  };

  try {
    // ✅ Eseye ak include (si asosiyasyon an egziste)
    const hasAssoc = !!(ContentBlock.associations && ContentBlock.associations.translations);
    if (hasAssoc) {
      try {
        const rows = await ContentBlock.findAll({
          where: { page, is_active: true },
          order: [["position", "ASC"], ["id", "ASC"]],
          include: [{
            model: ContentTranslation,
            as: "translations",
            required: false,
            where: wantedLangs.length ? { lang: { [Op.in]: wantedLangs } } : undefined,
          }],
        });
        return res.json(mapWithTranslations(rows));
      } catch (innerErr) {
        console.warn("⚠️ include(translations) failed, fallback san include:", innerErr?.message);
        // epi nou tonbe nan fallback anba a
      }
    }

    // 🔁 Fallback san include (jamais 500)
    const rows = await ContentBlock.findAll({
      where: { page, is_active: true },
      order: [["position", "ASC"], ["id", "ASC"]],
    });
    return res.json(rows);
  } catch (e) {
    if (e?.parent?.code === "42703") {
      // kolòn ki manke nan content_blocks
      console.error("public/content schema error (missing column):", e.parent?.message);
      return res.status(500).json({
        ok: false,
        error: "Database schema mismatch. Verify columns on content_blocks (deleted_at, is_active, lang).",
      });
    }
    console.error("public/content error:", e);
    res.status(500).json({ ok: false, error: e.message });
  }
});

/* -------- OPTIONAL: PUBLIC CONTENT AUTO (traduction à la volée) -------- */
let translator = null;
try { translator = require("../utils/translator"); } catch (_) {}
const SOURCE_LANG = String(process.env.SOURCE_LANG || "en").toLowerCase();

function normalizeRow(defaultPage) {
  return (rawRow) => {
    const raw = rawRow?.toJSON ? rawRow.toJSON() : rawRow;
    const body = raw.body ?? raw.content ?? raw.description ?? "";
    const media_url = raw.media_url ?? raw.mediaUrl ?? raw.url ?? raw.src ?? null;
    return {
      id: raw.id,
      page: String(raw.page || defaultPage || "home").toLowerCase(),
      slot: String(raw.slot || "body").toLowerCase(),
      type: String(raw.type || "").toLowerCase(),
      title: raw.title || "",
      body,
      media_url,
      position: raw.position ?? 0,
      is_active: raw.is_active !== undefined ? !!raw.is_active : true,
      lang: String(raw.lang || "").toLowerCase() || undefined,
    };
  };
}
function layoutKey(b) { return `k:${(b.slot||"").toLowerCase()}|${(b.type||"").toLowerCase()}|${b.position??0}`; }
function dedupeByLayout(list) {
  const m = new Map();
  for (const b of list) {
    const k = layoutKey(b);
    if (!m.has(k)) m.set(k, b);
  }
  return Array.from(m.values()).sort((a,b)=>(a.position??0)-(b.position??0)||(a.id??0)-(b.id??0));
}
function isTranslatable(b) {
  const t = (b.type||"").toLowerCase();
  const hasTextBody = !!(b.body && String(b.body).trim());
  return t==="text" || t==="html" || (t==="image" && hasTextBody);
}

router.get("/content-auto", async (req, res) => {
  try {
    const page       = String(req.query.page || "home").toLowerCase();
    const targetLang = String(req.query.lang || "").toLowerCase();

    // li orijinal yo (lang baz)
    const srcRows = await ContentBlock.findAll({
      where: { page, is_active: true, lang: SOURCE_LANG },
      order: [["position", "ASC"], ["id", "ASC"]],
    });
    const base = (srcRows||[]).map(normalizeRow(page));

    if (!translator || !targetLang || targetLang === SOURCE_LANG) {
      return res.json(dedupeByLayout(base));
    }

    const out = [];
    for (const b of base) {
      if (!isTranslatable(b)) { out.push(b); continue; }
      try {
        const t = await translator.translateBlock({ id:b.id, type:b.type, title:b.title, body:b.body }, targetLang);
        out.push({ ...b, title: t.title, body: t.body, lang: targetLang });
      } catch {
        out.push(b);
      }
    }
    res.json(dedupeByLayout(out));
  } catch (e) {
    if (e?.parent?.code === "42703") {
      console.error("public/content-auto schema error (missing column):", e.parent?.message);
      return res.status(500).json({
        ok: false,
        error: "Database schema mismatch. Verify columns on content_blocks.",
      });
    }
    console.error("public/content-auto error:", e);
    res.status(500).json({ ok: false, error: e.message });
  }
});

module.exports = router;
