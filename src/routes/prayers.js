const express = require('express');
const Prayer = require('../models/prayer');
const { requireRole } = require('../middleware/auth');
const router = express.Router();

router.post('/', async (req, res) => {
  const { name, email, content, is_public } = req.body;
  if (!name || !content) return res.status(400).json({ error: 'Missing fields' });
  const p = await Prayer.create({ name, email, content, is_public: !!is_public });
  res.status(201).json(p);
});

// Admin: list requests
router.get('/', requireRole('ADMIN','EDITOR'), async (req, res) => {
  const items = await Prayer.findAll({ order: [['createdAt','DESC']] });
  res.json(items);
});

module.exports = router;
