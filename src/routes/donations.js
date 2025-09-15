/*const express = require("express");
const Donation = require("../models/Donation");
const Member = require("../models/member"); // ← PA 'Members'
const router = express.Router();

/* ... rès CRUD yo ... */

// module.exports = router;

const express = require("express");
const Donation = require("../models/Donation");
const Member = require("../models/member");
const router = express.Router();

// CREATE
router.post("/", async (req, res) => {
  try {
    const { member_id, amount, method, fund, status } = req.body;
    if (!amount || !method || !fund) return res.status(400).json({ error: "amount, method, fund are required" });

    // validate member if provided
    if (member_id) {
      const exists = await Member.findByPk(member_id);
      if (!exists) return res.status(400).json({ error: "member_id not found" });
    }

    const d = await Donation.create({ member_id, amount, method, fund, status });
    res.status(201).json(d);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// READ ALL (include member basic info)
router.get("/", async (_req, res) => {
  try {
    const list = await Donation.findAll({
      order: [["donation_id", "DESC"]],
      include: [{ model: Member, attributes: ["member_id", "first_name", "last_name", "email"] }]
    });
    res.json(list);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// READ ONE
router.get("/:id", async (req, res) => {
  try {
    const d = await Donation.findByPk(req.params.id, {
      include: [{ model: Member, attributes: ["member_id", "first_name", "last_name", "email"] }]
    });
    if (!d) return res.status(404).json({ error: "Not found" });
    res.json(d);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// UPDATE
router.put("/:id", async (req, res) => {
  try {
    const d = await Donation.findByPk(req.params.id);
    if (!d) return res.status(404).json({ error: "Not found" });
    await d.update(req.body);
    res.json(d);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// DELETE
router.delete("/:id", async (req, res) => {
  try {
    const d = await Donation.findByPk(req.params.id);
    if (!d) return res.status(404).json({ error: "Not found" });
    await d.destroy();
    res.json({ ok: true });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

module.exports = router;



