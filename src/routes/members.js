/*const express = require("express");
const Member = require("../models/member"); // ← singilye, matche ak src/models/Member.js
const router = express.Router();

/* ... rès CRUD yo ... */

// module.exports = router;


const express = require("express");
const Member = require("../models/member");
const router = express.Router();

// CREATE
router.post("/", async (req, res) => {
  try {
    const { first_name, last_name, email, phone, address, joined_at } = req.body;
    if (!first_name || !last_name) return res.status(400).json({ error: "first_name and last_name are required" });
    const m = await Member.create({ first_name, last_name, email, phone, address, joined_at });
    res.status(201).json(m);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// READ ALL
router.get("/", async (_req, res) => {
  try {
    const list = await Member.findAll({ order: [["member_id", "DESC"]] });
    res.json(list);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// READ ONE
router.get("/:id", async (req, res) => {
  try {
    const m = await Member.findByPk(req.params.id);
    if (!m) return res.status(404).json({ error: "Not found" });
    res.json(m);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// UPDATE
router.put("/:id", async (req, res) => {
  try {
    const m = await Member.findByPk(req.params.id);
    if (!m) return res.status(404).json({ error: "Not found" });
    await m.update(req.body);
    res.json(m);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// DELETE
router.delete("/:id", async (req, res) => {
  try {
    const m = await Member.findByPk(req.params.id);
    if (!m) return res.status(404).json({ error: "Not found" });
    await m.destroy();
    res.json({ ok: true });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

module.exports = router;


