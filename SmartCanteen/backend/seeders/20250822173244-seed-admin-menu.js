'use strict';
module.exports = {
  async up (queryInterface) {
    await queryInterface.bulkInsert('users', [
      {
        role: 'ADMIN', name: 'Admin', email: 'admin@canteen.local', password_hash: '$2b$12$xuM0jG6Zzbzrqr1/fhxVF.K5BRxAgK6dN.MGt3yvXUw1o7kqlNhna', pending_balance_cents: 0, created_at: new Date()
      }
    ]);
    await queryInterface.bulkInsert('menu_items', [
      { name: 'Chicken Rice', price_cents: 450, is_active: true, created_at: new Date() },
      { name: 'Veg Noodles', price_cents: 400, is_active: true, created_at: new Date() },
      { name: 'Iced Tea', price_cents: 150, is_active: true, created_at: new Date() }
    ]);
  },
  async down (queryInterface) {
    await queryInterface.bulkDelete('users', { email: 'admin@canteen.local' });
    await queryInterface.bulkDelete('menu_items', null, {});
  }
};
