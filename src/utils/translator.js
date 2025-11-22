const crypto = require("crypto");
const fetch  = require("node-fetch");
const sequelize = require("../config/db");
const ContentTranslation = require("../models/ContentTranslation");

const SOURCE_LANG = (process.env.SOURCE_LANG || "en").toLowerCase();
const TRANSLATOR  = (process.env.TRANSLATOR || "libre").toLowerCase();
const LIBRE_URL   = process.env.LIBRE_URL || "https://libretranslate.de";

const USE_DB_CACHE = String(process.env.TRANSLATION_CACHE_DB || "1") === "1";
const TTL = parseInt(process.env.TRANSLATION_CACHE_TTL || "900", 10); // 15mn

// Kach nan memwa: key = `${block_id}|${lang}|${hash}`
const memCache = new Map();
function nowSec(){ return Math.floor(Date.now()/1000); }

function hashContent(title, body) {
  const h = crypto.createHash("sha256");
  h.update(String(title||"")); h.update("\n");
  h.update(String(body||""));
  return h.digest("hex");
}

async function libreTranslate(text, target, isHtml=false) {
  if (!text?.trim()) return "";
  const res = await fetch(`${LIBRE_URL}/translate`, {
    method: "POST",
    headers: { "Content-Type":"application/json" },
    body: JSON.stringify({
      q: text, source: "auto", target,
      format: isHtml ? "html" : "text"
    })
  });
  if (!res.ok) throw new Error(`LibreTranslate ${res.status}`);
  const j = await res.json();
  return j?.translatedText || text;
}

async function translateText(text, to, isHtml=false) {
  if (!text) return "";
  if (to === SOURCE_LANG) return text;
  if (TRANSLATOR === "libre") return libreTranslate(text, to, isHtml);
  return text; // fallback no-op
}

async function getFromDb(block_id, lang, content_hash) {
  if (!USE_DB_CACHE) return null;
  return await ContentTranslation.findOne({
    where: { block_id, lang, content_hash }
  });
}

async function saveToDb(block_id, lang, content_hash, title, body) {
  if (!USE_DB_CACHE) return;
  try {
    await ContentTranslation.findOrCreate({
      where: { block_id, lang, content_hash },
      defaults: { title, body }
    });
  } catch {} // evite kraze si doublon
}

async function translateBlock({ id, type, title, body }, targetLang) {
  const isHtml = String(type||"").toLowerCase() === "html";
  const content_hash = hashContent(title, body);
  const memKey = `${id}|${targetLang}|${content_hash}`;

  // memwa
  const cached = memCache.get(memKey);
  if (cached && cached.exp > nowSec()) {
    return { title: cached.title, body: cached.body };
  }

  // DB
  const dbHit = await getFromDb(id, targetLang, content_hash);
  if (dbHit) {
    memCache.set(memKey, { title: dbHit.title, body: dbHit.body, exp: nowSec()+TTL });
    return { title: dbHit.title, body: dbHit.body };
  }

  // Tradui
  const tTitle = await translateText(title||"", targetLang, false);
  const tBody  = await translateText(body||"",  targetLang, isHtml);

  // save
  memCache.set(memKey, { title: tTitle, body: tBody, exp: nowSec()+TTL });
  await saveToDb(id, targetLang, content_hash, tTitle, tBody);

  return { title: tTitle, body: tBody };
}

module.exports = {
  translateBlock,
  hashContent,
};

/*const crypto = require("crypto");
const fetch  = require("node-fetch");
const sequelize = require("../config/db");
const ContentTranslation = require("../models/ContentTranslation");

const SOURCE_LANG = (process.env.SOURCE_LANG || "en").toLowerCase();
const TRANSLATOR  = (process.env.TRANSLATOR || "libre").toLowerCase();
const LIBRE_URL   = process.env.LIBRE_URL || "https://libretranslate.de";

const USE_DB_CACHE = String(process.env.TRANSLATION_CACHE_DB || "1") === "1";
const TTL = parseInt(process.env.TRANSLATION_CACHE_TTL || "900", 10); // 15 min

const memCache = new Map();
function nowSec(){ return Math.floor(Date.now()/1000); }

function hashContent(title, body) {
  const h = crypto.createHash("sha256");
  h.update(String(title||"")); h.update("\n");
  h.update(String(body||""));
  return h.digest("hex");
}

async function libreTranslate(text, target, isHtml=false) {
  if (!text?.trim()) return "";
  const res = await fetch(`${LIBRE_URL}/translate`, {
    method: "POST",
    headers: { "Content-Type":"application/json" },
    body: JSON.stringify({
      q: text, source: "auto", target,
      format: isHtml ? "html" : "text"
    })
  });
  if (!res.ok) throw new Error(`LibreTranslate ${res.status}`);
  const j = await res.json();
  return j?.translatedText || text;
}

async function translateText(text, to, isHtml=false) {
  if (!text) return "";
  if (to === SOURCE_LANG) return text;
  if (TRANSLATOR === "libre") return libreTranslate(text, to, isHtml);
  return text;
}

async function getFromDb(block_id, lang, content_hash) {
  if (!USE_DB_CACHE) return null;
  return await ContentTranslation.findOne({
    where: { block_id, lang, content_hash }
  });
}

async function saveToDb(block_id, lang, content_hash, title, body) {
  if (!USE_DB_CACHE) return;
  try {
    await ContentTranslation.findOrCreate({
      where: { block_id, lang, content_hash },
      defaults: { title, body }
    });
  } catch {}
}

async function translateBlock({ id, type, title, body }, targetLang) {
  const isHtml = String(type||"").toLowerCase() === "html";
  const content_hash = hashContent(title, body);
  const memKey = `${id}|${targetLang}|${content_hash}`;

  const cached = memCache.get(memKey);
  if (cached && cached.exp > nowSec()) {
    return { title: cached.title, body: cached.body };
  }

  const dbHit = await getFromDb(id, targetLang, content_hash);
  if (dbHit) {
    memCache.set(memKey, { title: dbHit.title, body: dbHit.body, exp: nowSec()+TTL });
    return { title: dbHit.title, body: dbHit.body };
  }

  const tTitle = await translateText(title||"", targetLang, false);
  const tBody  = await translateText(body||"",  targetLang, isHtml);

  memCache.set(memKey, { title: tTitle, body: tBody, exp: nowSec()+TTL });
  await saveToDb(id, targetLang, content_hash, tTitle, tBody);

  return { title: tTitle, body: tBody };
}

module.exports = { translateBlock, hashContent };*/

