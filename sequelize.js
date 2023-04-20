require("dotenv").config();
const { Sequelize } = require("sequelize");

const sequelize = new Sequelize(
  process.env.DBNAME,
  process.env.DBUSER,
  process.env.DBPASS,
  {
    host: process.env.DBHOST,
    dialect: process.env.DIALECT,
  }
);

module.exports = { sequelize };
