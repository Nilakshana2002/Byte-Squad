require('dotenv').config();
const { URL } = require('url');
const mysqlUrl = process.env.MYSQL_URL || 'mysql://user:pass@localhost:3306/canteen';
const url = new URL(mysqlUrl);
module.exports = {
  development: {
    username: url.username,
    password: url.password,
    database: url.pathname.replace('/', ''),
    host: url.hostname,
    port: url.port || 3306,
    dialect: 'mysql'
  },
  production: {
    username: url.username,
    password: url.password,
    database: url.pathname.replace('/', ''),
    host: url.hostname,
    port: url.port || 3306,
    dialect: 'mysql',
    logging: false
  }
};
