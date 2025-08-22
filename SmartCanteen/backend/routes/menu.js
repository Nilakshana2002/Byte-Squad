const express = require('express');
const { MenuItem } = require('../models');
const { authRequired, requireRole } = require('../middleware/auth');

const router = express.Router();

// Public menu
router.get('/', async (_, res) => {
  const items = await MenuItem.findAll({ where: { is_active: true } });
  res.json(items);
});

// Admin CRUD
router.post('/', authRequired, requireRole('ADMIN'), async (req, res) => {
  const item = await MenuItem.create(req.body);
  res.status(201).json(item);
});

router.put('/:id', authRequired, requireRole('ADMIN'), async (req, res) => {
  const item = await MenuItem.findByPk(req.params.id);
  if (!item) return res.sendStatus(404);
  await item.update(req.body);
  res.json(item);
});

router.delete('/:id', authRequired, requireRole('ADMIN'), async (req, res) => {
  const item = await MenuItem.findByPk(req.params.id);
  if (!item) return res.sendStatus(404);
  await item.destroy();
  res.sendStatus(204);
});

module.exports = router;
