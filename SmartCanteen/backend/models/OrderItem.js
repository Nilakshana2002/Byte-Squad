const { DataTypes, Model } = require('sequelize');
const { sequelize } = require('../db');

class OrderItem extends Model {}

OrderItem.init(
  {
    qty: { type: DataTypes.INTEGER, allowNull: false },
    price_cents: { type: DataTypes.INTEGER, allowNull: false },
    // no need to declare order_id / menu_item_id here, they come from associations
  },
  {
    sequelize,
    modelName: 'order_item',
    underscored: true,   // 👈 this makes Sequelize map FKs to snake_case
    timestamps: false,
  }
);

module.exports = OrderItem;
