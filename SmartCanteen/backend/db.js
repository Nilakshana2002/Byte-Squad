const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(process.env.MYSQL_URL, {
  dialect: 'mysql',
  pool: { max: 10, min: 0, idle: 10000 },
  logging: false
});

module.exports = { sequelize };
