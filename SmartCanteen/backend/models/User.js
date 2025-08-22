const { DataTypes, Model } = require('sequelize');
const { sequelize } = require('../db');

class User extends Model {}
User.init({
  role: { type: DataTypes.ENUM('STUDENT','STAFF','ADMIN'), allowNull: false, defaultValue: 'STUDENT' },
  name: { type: DataTypes.STRING(120), allowNull: false },
  email: { type: DataTypes.STRING(160), unique: true, allowNull: false },
  password_hash: { type: DataTypes.STRING, allowNull: false },
  pending_balance_cents: { type: DataTypes.INTEGER, defaultValue: 0 }
}, { sequelize, modelName: 'user', timestamps: true, createdAt: 'created_at', updatedAt: false });

module.exports = User;
