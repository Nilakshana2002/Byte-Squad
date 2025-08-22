const { DataTypes, Model } = require('sequelize');
const { sequelize } = require('../db');

class Payment extends Model {}
Payment.init({
  method: { type: DataTypes.ENUM('ONLINE','PICKUP','ADJUSTMENT'), allowNull: false },
  amount_cents: { type: DataTypes.INTEGER, allowNull: false }
}, { sequelize, modelName: 'payment', timestamps: true, createdAt: 'created_at', updatedAt: false });

module.exports = Payment;
