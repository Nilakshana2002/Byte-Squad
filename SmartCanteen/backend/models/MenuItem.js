const { DataTypes, Model } = require('sequelize');
const { sequelize } = require('../db');

class MenuItem extends Model {}
MenuItem.init({
  name: { type: DataTypes.STRING(120), allowNull: false },
  price_cents: { type: DataTypes.INTEGER, allowNull: false },
  is_active: { type: DataTypes.BOOLEAN, defaultValue: true },
  stock: { type: DataTypes.INTEGER, allowNull: true }
}, { sequelize, modelName: 'menu_item', timestamps: true, createdAt: 'created_at', updatedAt: false });

module.exports = MenuItem;
