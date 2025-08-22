const express = require('express');
const QRCode = require('qrcode');
const { Op } = require('sequelize');
const { sequelize } = require('../db');
const { Order, OrderItem, MenuItem, Payment, User } = require('../models');
const { authRequired, requireRole } = require('../middleware/auth');

const router = express.Router();

// tiny async handler to avoid repeating try/catch in simple GETs
const ah = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

// ----- Create order (auth required; binds to req.user) ---------------------------------
router.post('/', authRequired, ah(async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const { items, payNow } = req.body || {};
    if (!Array.isArray(items) || items.length === 0) throw new Error('No items.');

    const ids = items.map(i => i.id);
    const dbItems = await MenuItem.findAll({
      where: { id: ids, is_active: true },
      transaction: t,
      lock: t.LOCK.UPDATE
    });

    // ensure every requested id exists & active
    const priceBook = Object.fromEntries(dbItems.map(i => [i.id, i.price_cents]));
    for (const it of items) {
      if (!priceBook[it.id]) throw new Error(`Unavailable item: ${it.id}`);
      if (!Number.isInteger(it.qty) || it.qty <= 0) throw new Error('Invalid qty');
    }

    const total = items.reduce((s, i) => s + priceBook[i.id] * i.qty, 0);

    const order = await Order.create(
      { userId: req.user.id, total_cents: total, status: 'PENDING', pay_status: 'UNPAID' },
      { transaction: t }
    );

    for (const it of items) {
      await OrderItem.create(
        {
          order_id: order.id,  
          menu_item_id: it.id, 
          qty: it.qty,
          price_cents: priceBook[it.id],
        },
        { transaction: t }
      );
    }


    order.qr_code = await QRCode.toDataURL(`ORDER:${order.id}`);
    if (payNow) {
      await Payment.create(
        { orderId: order.id, method: 'ONLINE', amount_cents: total },
        { transaction: t }
      );
      order.pay_status = 'PAID_ONLINE';
    }
    await order.save({ transaction: t });

    await t.commit();
    res.status(201).json(order);
  } catch (e) {
    await t.rollback();
    res.status(400).json({ error: e.message });
  }
}));

// QR code for order
router.get('/:id/qr.png', authRequired, requireRole('ADMIN','STAFF'), async (req, res) => {
  const order = await Order.findByPk(req.params.id)
  if (!order) return res.sendStatus(404)
  const png = await QRCode.toBuffer(`ORDER:${order.id}`, { type: 'png', scale: 6 })
  res.setHeader('Content-Type', 'image/png')
  res.send(png)
})

// ----- List orders (Kitchen/STaff/Admin) -----------------------------------------------
// /api/orders?status=PENDING|PREPARING|READY&limit=20&offset=0
router.get('/', authRequired, requireRole('ADMIN', 'STAFF'), ah(async (req, res) => {
  const { status, limit = 50, offset = 0 } = req.query;
  const where = {};
  if (status) where.status = status;

  const orders = await Order.findAll({
    where,
    include: [
      { model: OrderItem, include: [MenuItem] },
      User
    ],
    order: [['created_at', 'ASC']],
    limit: Math.min(Number(limit) || 50, 200),
    offset: Number(offset) || 0
  });

  res.json(orders);
}));

// ----- Transition helpers ---------------------------------------------------------------

router.post('/:id/preparing', authRequired, requireRole('ADMIN','STAFF'), ah(async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const order = await Order.findByPk(req.params.id, { transaction: t, lock: t.LOCK.UPDATE });
    if (!order) return res.sendStatus(404);
    order.status = 'PREPARING';
    await order.save({ transaction: t });
    await t.commit();
    res.json(order);
  } catch (e) { await t.rollback(); res.status(400).json({ error: e.message }); }
}));

router.post('/:id/ready', authRequired, requireRole('ADMIN','STAFF'), ah(async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const order = await Order.findByPk(req.params.id, { transaction: t, lock: t.LOCK.UPDATE });
    if (!order) return res.sendStatus(404);
    order.status = 'READY';
    order.ready_at = new Date();
    await order.save({ transaction: t });
    await t.commit();
    res.json(order);
  } catch (e) { await t.rollback(); res.status(400).json({ error: e.message }); }
}));

router.post('/:id/pickup', authRequired, requireRole('ADMIN','STAFF'), ah(async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const order = await Order.findByPk(req.params.id, { transaction: t, lock: t.LOCK.UPDATE });
    if (!order) return res.sendStatus(404);
    if (order.pay_status === 'UNPAID') {
      await Payment.create({ orderId: order.id, method: 'PICKUP', amount_cents: order.total_cents }, { transaction: t });
      order.pay_status = 'PAID_ON_PICKUP';
    }
    order.status = 'COMPLETED';
    await order.save({ transaction: t });
    await t.commit();
    res.json(order);
  } catch (e) { await t.rollback(); res.status(400).json({ error: e.message }); }
}));

router.post('/:id/no-show', authRequired, requireRole('ADMIN','STAFF'), ah(async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const order = await Order.findByPk(req.params.id, { transaction: t, lock: t.LOCK.UPDATE });
    if (!order) return res.sendStatus(404);
    order.status = 'NO_SHOW';
    await order.save({ transaction: t });

    if (order.userId) {
      const user = await order.getUser({ transaction: t, lock: t.LOCK.UPDATE });
      user.pending_balance_cents += order.total_cents;
      await user.save({ transaction: t });
    }
    await t.commit();
    res.json(order);
  } catch (e) { await t.rollback(); res.status(400).json({ error: e.message }); }
}));

// ----- Generic status updater (optional, use from admin tools) -------------------------
router.patch('/:id/status', authRequired, requireRole('ADMIN','STAFF'), ah(async (req, res) => {
  const { status } = req.body || {};
  const allowed = new Set(['PENDING','PREPARING','READY','COMPLETED','NO_SHOW','CANCELLED']);
  if (!allowed.has(status)) return res.status(400).json({ error: 'Invalid status' });

  const t = await sequelize.transaction();
  try {
    const order = await Order.findByPk(req.params.id, { transaction: t, lock: t.LOCK.UPDATE });
    if (!order) return res.sendStatus(404);
    order.status = status;
    if (status === 'READY') order.ready_at = new Date();
    await order.save({ transaction: t });
    await t.commit();
    res.json(order);
  } catch (e) { await t.rollback(); res.status(400).json({ error: e.message }); }
}));

// ----- QR helper: serve PNG for easy scanning on staff devices -------------------------
router.get('/:id/qr.png', authRequired, requireRole('ADMIN','STAFF'), ah(async (req, res) => {
  const order = await Order.findByPk(req.params.id);
  if (!order) return res.sendStatus(404);
  const png = await QRCode.toBuffer(`ORDER:${order.id}`, { type: 'png', scale: 6 });
  res.setHeader('Content-Type', 'image/png');
  res.send(png);
}));

module.exports = router;
