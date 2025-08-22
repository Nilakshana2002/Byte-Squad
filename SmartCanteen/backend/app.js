// backend/app.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { sequelize } = require('./db');
const authRoutes = require('./routes/auth');
const menuRoutes = require('./routes/menu');
const orderRoutes = require('./routes/orders');

const app = express();
app.use(express.json());
app.use(cors({ origin: process.env.CORS_ORIGIN?.split(',') || true, credentials: true }));

app.get('/health', (_, res) => res.json({ ok: true }));

app.use('/auth', authRoutes);
app.use('/api/menu', menuRoutes);
app.use('/api/orders', orderRoutes);

// (optional) global error handler so MySQL/Sequelize errors are visible in logs
app.use((err, req, res, next) => {
  console.error('Express error:', err);
  res.status(500).json({ error: err.message || 'Internal error' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync(); // use migrations in prod
    console.log('API ready on :' + PORT);
  } catch (e) {
    console.error('DB init failed:', e);
    process.exit(1);
  }
});
