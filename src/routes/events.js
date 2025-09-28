const express = require("express");
const Event = require("../models/Event");
const router = express.Router();

// CREATE
router.post("/", async (req, res) => {
  try {
    const { title, description, location, starts_at, ends_at } = req.body;
    if (!title || !starts_at) return res.status(400).json({ error: "title and starts_at are required" });
    const ev = await Event.create({ title, description, location, starts_at, ends_at });
    res.status(201).json(ev);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// READ ALL
router.get("/", async (_req, res) => {
  try {
    const list = await Event.findAll({ order: [["event_id", "DESC"]] });
    res.json(list);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// READ ONE
router.get("/:id", async (req, res) => {
  try {
    const ev = await Event.findByPk(req.params.id);
    if (!ev) return res.status(404).json({ error: "Not found" });
    res.json(ev);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// UPDATE
router.put("/:id", async (req, res) => {
  try {
    const ev = await Event.findByPk(req.params.id);
    if (!ev) return res.status(404).json({ error: "Not found" });
    await ev.update(req.body);
    res.json(ev);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// DELETE
router.delete("/:id", async (req, res) => {
  try {
    const ev = await Event.findByPk(req.params.id);
    if (!ev) return res.status(404).json({ error: "Not found" });
    await ev.destroy();
    res.json({ ok: true });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

module.exports = router;
