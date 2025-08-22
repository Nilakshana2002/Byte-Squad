'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    const { INTEGER, STRING, ENUM, BOOLEAN, BIGINT, TEXT, DATE } = Sequelize;
    await queryInterface.createTable('users', {
      id: { type: BIGINT, primaryKey: true, autoIncrement: true },
      role: { type: ENUM('STUDENT','STAFF','ADMIN'), allowNull: false },
      name: { type: STRING(120), allowNull: false },
      email: { type: STRING(160), unique: true },
      password_hash: { type: STRING, allowNull: false },
      pending_balance_cents: { type: INTEGER, defaultValue: 0 },
      created_at: { type: DATE, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') }
    });
    await queryInterface.createTable('menu_items', {
      id: { type: BIGINT, primaryKey: true, autoIncrement: true },
      name: { type: STRING(120), allowNull: false },
      price_cents: { type: INTEGER, allowNull: false },
      is_active: { type: BOOLEAN, defaultValue: true },
      stock: { type: INTEGER, allowNull: true },
      created_at: { type: DATE, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') }
    });
    await queryInterface.createTable('orders', {
      id: { type: BIGINT, primaryKey: true, autoIncrement: true },
      user_id: { type: BIGINT, allowNull: true,
        references: { model: 'users', key: 'id' }, onUpdate: 'CASCADE', onDelete: 'SET NULL' },
      status: { type: ENUM('PENDING','PREPARING','READY','COMPLETED','NO_SHOW','CANCELLED'), defaultValue: 'PENDING' },
      pay_status: { type: ENUM('UNPAID','PAID_ONLINE','PAID_ON_PICKUP'), defaultValue: 'UNPAID' },
      qr_code: { type: TEXT, allowNull: true },
      total_cents: { type: INTEGER, allowNull: false },
      created_at: { type: DATE, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
      ready_at: { type: DATE, allowNull: true }
    });
    await queryInterface.createTable('order_items', {
      id: { type: BIGINT, primaryKey: true, autoIncrement: true },
      order_id: { type: BIGINT, allowNull: false,
        references: { model: 'orders', key: 'id' }, onUpdate: 'CASCADE', onDelete: 'CASCADE' },
      menu_item_id: { type: BIGINT, allowNull: false,
        references: { model: 'menu_items', key: 'id' }, onUpdate: 'CASCADE', onDelete: 'RESTRICT' },
      qty: { type: INTEGER, allowNull: false },
      price_cents: { type: INTEGER, allowNull: false }
    });
    await queryInterface.createTable('payments', {
      id: { type: BIGINT, primaryKey: true, autoIncrement: true },
      order_id: { type: BIGINT, allowNull: false,
        references: { model: 'orders', key: 'id' }, onUpdate: 'CASCADE', onDelete: 'CASCADE' },
      method: { type: ENUM('ONLINE','PICKUP','ADJUSTMENT'), allowNull: false },
      amount_cents: { type: INTEGER, allowNull: false },
      created_at: { type: DATE, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') }
    });
  },
  async down(queryInterface) {
    await queryInterface.dropTable('payments');
    await queryInterface.dropTable('order_items');
    await queryInterface.dropTable('orders');
    await queryInterface.dropTable('menu_items');
    await queryInterface.dropTable('users');
  }
};
