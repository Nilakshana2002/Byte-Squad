// backend/models/Order.js
const { DataTypes, Model } = require('sequelize');
const { sequelize } = require('../db');

class Order extends Model {}
Order.init({
  status: {
    type: DataTypes.ENUM('PENDING','PREPARING','READY','COMPLETED','NO_SHOW','CANCELLED'),
    defaultValue: 'PENDING'
  },
  pay_status: {
    type: DataTypes.ENUM('UNPAID','PAID_ONLINE','PAID_ON_PICKUP'),
    defaultValue: 'UNPAID'
  },
  qr_code:      { type: DataTypes.TEXT,     allowNull: true },
  total_cents:  { type: DataTypes.INTEGER,  allowNull: false },
  ready_at:     { type: DataTypes.DATE,     allowNull: true }
}, {
  sequelize,
  modelName: 'order',
  underscored: true,           // <- make all auto columns + FKs snake_case
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: false
});

module.exports = Order;
