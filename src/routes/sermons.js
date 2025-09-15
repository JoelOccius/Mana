const express = require('express');
const Sermon = require('../models/Sermon');
const { requireRole } = require('../middleware/auth');
const router = express.Router();

router.get('/', async (req, res) => {
  const sermons = await Sermon.findAll({ order: [['date','DESC']] });
  res.json(sermons);
});

router.get('/:id', async (req, res) => {
  const s = await Sermon.findByPk(req.params.id);
  if (!s) return res.status(404).json({ error: 'Not found' });
  res.json(s);
});

router.post('/', requireRole('ADMIN','EDITOR'), async (req, res) => {
  const s = await Sermon.create(req.body);
  res.status(201).json(s);
});

router.put('/:id', requireRole('ADMIN','EDITOR'), async (req, res) => {
  const s = await Sermon.findByPk(req.params.id);
  if (!s) return res.status(404).json({ error: 'Not found' });
  await s.update(req.body);
  res.json(s);
});

router.delete('/:id', requireRole('ADMIN'), async (req, res) => {
  const s = await Sermon.findByPk(req.params.id);
  if (!s) return res.status(404).json({ error: 'Not found' });
  await s.destroy();
  res.json({ ok: true });
});

module.exports = router;
