// backend/models/index.js
const User = require('./User');
const MenuItem = require('./MenuItem');
const Order = require('./Order');
const OrderItem = require('./OrderItem');
const Payment = require('./Payment');

// Use explicit snake_case FKs to match the DB columns created by migrations
User.hasMany(Order,           { foreignKey: 'user_id' });
Order.belongsTo(User,         { foreignKey: 'user_id' });

Order.hasMany(OrderItem,      { foreignKey: 'order_id' });
OrderItem.belongsTo(Order,    { foreignKey: 'order_id' });

MenuItem.hasMany(OrderItem,   { foreignKey: 'menu_item_id' });
OrderItem.belongsTo(MenuItem, { foreignKey: 'menu_item_id' });

Order.hasMany(Payment,        { foreignKey: 'order_id' });
Payment.belongsTo(Order,      { foreignKey: 'order_id' });

module.exports = { User, MenuItem, Order, OrderItem, Payment };
